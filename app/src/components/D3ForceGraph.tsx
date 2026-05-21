import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { LinkMode, WeightMode } from '../utils/search'

export type { LinkMode, WeightMode }

export interface GraphNode extends d3.SimulationNodeDatum {
  id: number
  label: string
  type: 'tag' | 'recipe' | 'component'
  url?: string
}

export interface GraphLink {
  source: number | GraphNode
  target: number | GraphNode
  weightRaw: number
  weight?: number
  baseColor?: string | null
}

export type LayoutMode = 'force' | 'radial' | 'circle' | 'rings' | 'spiral'

interface Props {
  nodes: GraphNode[]
  links: GraphLink[]
  selectedTags: Set<string>
  onTagClick: (tag: string) => void
  onRecipeNavigate: (url: string) => void
  layoutMode?: LayoutMode
  weightMode?: WeightMode
  linkMode?: LinkMode
  weightingEnabled?: boolean
  impact?: number
}

const colorByType = (d: GraphNode) =>
  d.type === 'recipe' ? '#f97316' : d.type === 'component' ? '#F53200' : '#22c55e'

export function D3ForceGraph({
  nodes,
  links,
  selectedTags,
  onTagClick,
  onRecipeNavigate,
  layoutMode = 'force',
  weightMode = 'uniform',
  linkMode = 'auto',
  weightingEnabled = false,
  impact = 1,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Stable callback refs so D3 handlers always call the latest version
  const onTagClickRef = useRef(onTagClick)
  const onRecipeNavigateRef = useRef(onRecipeNavigate)
  useEffect(() => { onTagClickRef.current = onTagClick }, [onTagClick])
  useEffect(() => { onRecipeNavigateRef.current = onRecipeNavigate }, [onRecipeNavigate])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const svgEl = svgRef.current

    function getSize() {
      const r = container.getBoundingClientRect()
      return { w: Math.max(320, Math.floor(r.width)), h: Math.max(320, Math.floor(r.height)) }
    }

    let { w: width, h: height } = getSize()

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet')

    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => { g.attr('transform', event.transform) })
    svg.call(zoom)

    // Remove isolated nodes
    const usedIds = new Set<number>()
    for (const l of links) {
      usedIds.add(l.source as number)
      usedIds.add(l.target as number)
    }
    const filteredNodes = nodes.filter(n => usedIds.has(n.id))
    const filteredLinks: GraphLink[] = links
      .filter(l => usedIds.has(l.source as number) && usedIds.has(l.target as number))
      .map(l => ({ ...l }))

    // Normalize weights [0,1]
    const ext = d3.extent(filteredLinks, d => d.weightRaw) as [number, number]
    const norm = d3.scaleLinear().domain(ext[0] === ext[1] ? [0, 1] : ext).range([0, 1])
    filteredLinks.forEach(l => { l.weight = norm(l.weightRaw) })

    const idToNode = new Map(filteredNodes.map(n => [n.id, n]))

    const selectionModeActive = weightMode === 'select'
    const useWeighted = weightingEnabled && weightMode !== 'uniform'
    const useTokenToken = linkMode === 'token-token' || (linkMode === 'auto' && !nodes.some(n => n.type !== 'tag'))
    const useRecipeRecipe = linkMode === 'recipe-recipe'
    const colorizeByWeight = (useTokenToken || useRecipeRecipe) && weightingEnabled && weightMode !== 'uniform'

    const linkScale = d3.scaleLinear().domain([0, 1]).range([1, 4 + 6 * impact])
    const edgeColorScale = d3.scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(['#93c5fd', '#6366f1', '#7e22ce'])

    // Node degree within selection
    const nodeToDegreeWithinSelection = new Map<number, number>()
    if (selectionModeActive && selectedTags.size > 0) {
      for (const l of filteredLinks) {
        const sid = nodeId(l.source)
        const tid = nodeId(l.target)
        const a = idToNode.get(sid)
        const b = idToNode.get(tid)
        if (a?.type === 'tag' && selectedTags.has(a.label)) {
          nodeToDegreeWithinSelection.set(tid, (nodeToDegreeWithinSelection.get(tid) || 0) + 1)
          nodeToDegreeWithinSelection.set(sid, (nodeToDegreeWithinSelection.get(sid) || 0) + 1)
        }
        if (b?.type === 'tag' && selectedTags.has(b.label)) {
          nodeToDegreeWithinSelection.set(sid, (nodeToDegreeWithinSelection.get(sid) || 0) + 1)
          nodeToDegreeWithinSelection.set(tid, (nodeToDegreeWithinSelection.get(tid) || 0) + 1)
        }
      }
    }

    function computeDefaultRadius(d: GraphNode) {
      if (selectionModeActive && selectedTags.size > 0) {
        const deg = nodeToDegreeWithinSelection.get(d.id) || 0
        if (deg > 0) return (d.type === 'recipe' ? 7 : 5) + Math.min(6, 1 + Math.log2(1 + deg))
      }
      return d.type === 'recipe' ? 7 : 5
    }

    // Tag degree for edge coloring
    const tagDegree = new Map<number, number>()
    if (selectionModeActive) {
      for (const l of filteredLinks) {
        const sid = nodeId(l.source)
        const tid = nodeId(l.target)
        const a = idToNode.get(sid)
        const b = idToNode.get(tid)
        if (a?.type === 'tag') tagDegree.set(sid, (tagDegree.get(sid) || 0) + 1)
        if (b?.type === 'tag') tagDegree.set(tid, (tagDegree.get(tid) || 0) + 1)
      }
    }

    function defaultLinkStroke(d: GraphLink) {
      const sid = nodeId(d.source)
      const tid = nodeId(d.target)
      if (selectionModeActive && selectedTags.size > 0) {
        const sa = idToNode.get(sid)
        const sb = idToNode.get(tid)
        if ((sa?.type === 'tag' && selectedTags.has(sa.label)) ||
            (sb?.type === 'tag' && selectedTags.has(sb.label))) return '#F53200'
      }
      if (colorizeByWeight && d.baseColor) return d.baseColor
      return 'rgba(148,163,184,0.55)'
    }

    // Precompute edge colors
    filteredLinks.forEach(d => {
      const sid = nodeId(d.source)
      const tid = nodeId(d.target)
      if (selectionModeActive) {
        const a = idToNode.get(sid)
        const b = idToNode.get(tid)
        let degree = a?.type === 'tag' ? (tagDegree.get(sid) || 0) : (b?.type === 'tag' ? (tagDegree.get(tid) || 0) : 0)
        let maxDeg = 1
        for (const v of tagDegree.values()) if (v > maxDeg) maxDeg = v
        d.baseColor = edgeColorScale(Math.max(0, Math.min(1, degree / maxDeg)))
      } else if (colorizeByWeight) {
        d.baseColor = edgeColorScale(d.weight ?? 0)
      } else {
        d.baseColor = null
      }
    })

    // Forces
    const minDist = 24, baseDist = 80
    const linkForce = d3.forceLink<GraphNode, GraphLink>(filteredLinks as any)
      .id(d => (d as GraphNode).id)
      .distance(d => useWeighted ? baseDist - (baseDist - minDist) * (d.weight ?? 0) * impact : baseDist)
      .strength(d => useWeighted ? 0.2 + 0.6 * (d.weight ?? 0) * impact : 0.4)

    const simulation = d3.forceSimulation<GraphNode>(filteredNodes as any)
      .force('link', linkForce)
      .force('charge', d3.forceManyBody().strength(-80))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(18))

    if (layoutMode === 'radial') {
      const radiusFn = (d: GraphNode) =>
        d.type === 'recipe' || d.type === 'component' ? Math.min(width, height) / 3 : Math.min(width, height) / 2
      simulation.force('radial', d3.forceRadial<GraphNode>(radiusFn, width / 2, height / 2).strength(0.3))
    } else if (layoutMode === 'circle') {
      const R = Math.min(width, height) / 2.4
      const cx = width / 2, cy = height / 2
      ;(filteredNodes as any[]).forEach((n, i) => {
        const a = (2 * Math.PI * i) / filteredNodes.length
        n.fx = cx + R * Math.cos(a); n.fy = cy + R * Math.sin(a)
      })
      simulation.force('charge', d3.forceManyBody().strength(-10))
    } else if (layoutMode === 'rings') {
      const cx = width / 2, cy = height / 2
      const byType: Record<string, GraphNode[]> = { token: [], recipe: [], component: [] }
      filteredNodes.forEach(n => byType[n.type === 'component' ? 'component' : n.type === 'recipe' ? 'recipe' : 'token'].push(n))
      const placeRing = (arr: GraphNode[], R: number) =>
        (arr as any[]).forEach((n, i) => { const a = (2 * Math.PI * i) / Math.max(1, arr.length); n.fx = cx + R * Math.cos(a); n.fy = cy + R * Math.sin(a) })
      placeRing(byType.token, Math.min(width, height) * 0.42)
      placeRing(byType.component, Math.min(width, height) * 0.30)
      placeRing(byType.recipe, Math.min(width, height) * 0.18)
      simulation.force('charge', d3.forceManyBody().strength(-10))
    } else if (layoutMode === 'spiral') {
      const cx = width / 2, cy = height / 2
      ;(filteredNodes as any[]).forEach((n, i) => {
        const a = 0.35 * i; const r = 10 + 6 * a
        n.fx = cx + r * Math.cos(a); n.fy = cy + r * Math.sin(a)
      })
      simulation.force('charge', d3.forceManyBody().strength(-8))
    }

    // Links
    const linkLayer = g.append('g').attr('class', 'link-layer')
    const link = linkLayer.selectAll<SVGLineElement, GraphLink>('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('stroke', d => defaultLinkStroke(d))
      .attr('stroke-width', d => {
        if (!weightingEnabled || weightMode === 'uniform') return 1
        if (weightMode === 'select' && selectedTags.size === 0) return 1
        if (weightMode === 'select' && selectedTags.size > 0) {
          const sid = nodeId(d.source), tid = nodeId(d.target)
          const sa = idToNode.get(sid), sb = idToNode.get(tid)
          const aSel = sa?.type === 'tag' && selectedTags.has(sa.label)
          const bSel = sb?.type === 'tag' && selectedTags.has(sb.label)
          if (aSel || bSel) {
            const selNode = (aSel ? sa : sb)!
            const adj = filteredLinks.reduce((acc, L) => {
              const ls = nodeId(L.source), lt = nodeId(L.target)
              return acc + (ls === selNode.id || lt === selNode.id ? 1 : 0)
            }, 0)
            return 3 + Math.min(1, Math.log2(1 + adj) / 2)
          }
          return 1
        }
        return linkScale(d.weight ?? 0)
      })

    // Adjacency for hover
    const adjacency = new Map<number, Set<number>>()
    filteredLinks.forEach(l => {
      const sid = nodeId(l.source), tid = nodeId(l.target)
      if (!adjacency.has(sid)) adjacency.set(sid, new Set())
      if (!adjacency.has(tid)) adjacency.set(tid, new Set())
      adjacency.get(sid)!.add(tid)
      adjacency.get(tid)!.add(sid)
    })

    // Nodes
    const node = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(filteredNodes)
      .enter().append('g')
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on('start', (event, d: any) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on('drag', (event, d: any) => { d.fx = event.x; d.fy = event.y })
          .on('end', (event, d: any) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null })
      )

    // Tooltip
    let tipEl = document.getElementById('d3-viz-tooltip')
    if (!tipEl) {
      tipEl = document.createElement('div')
      tipEl.id = 'd3-viz-tooltip'
      tipEl.style.cssText = 'position:fixed;display:none;background:#111;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;pointer-events:none;z-index:9999'
      document.body.appendChild(tipEl)
    }
    function showTip(ev: PointerEvent, d: GraphNode) {
      const el = document.getElementById('d3-viz-tooltip')
      if (!el) return
      el.textContent = `${d.label} · ${d.type}`
      el.style.left = (ev.clientX + 16) + 'px'
      el.style.top = (ev.clientY - 16) + 'px'
      el.style.display = 'block'
    }
    function hideTip() { const el = document.getElementById('d3-viz-tooltip'); if (el) el.style.display = 'none' }

    const circles = node.append('circle')
      .attr('r', d => computeDefaultRadius(d))
      .attr('fill', d => colorByType(d))
      .attr('stroke', '#111')
      .attr('stroke-width', 0.6)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        hideTip()
        if (d.type === 'tag') {
          onTagClickRef.current(d.label)
        } else if ((d.type === 'recipe' || d.type === 'component') && d.url) {
          onRecipeNavigateRef.current(d.url)
        }
      })
      .on('mouseover', function(event, d) { applyHoverHighlight(d); showTip(event as unknown as PointerEvent, d) })
      .on('mousemove', function(event, d) { showTip(event as unknown as PointerEvent, d) })
      .on('mouseout', function() { resetHoverHighlight(); hideTip() })

    const labels = node.append('text')
      .text(d => d.label)
      .attr('x', 10).attr('y', 3)
      .attr('font-size', 10)
      .attr('fill', '#111')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.9)
      .style('pointer-events', 'none')

    node.selectAll('text').raise()

    function applyHoverHighlight(targetNode: GraphNode) {
      const focus = new Set([targetNode.id])
      const neigh = adjacency.get(targetNode.id)
      if (neigh) for (const nid of neigh) focus.add(nid)

      circles.transition().duration(120)
        .attr('r', n => focus.has(n.id) ? computeDefaultRadius(n) + (n.id === targetNode.id ? 2 : 1) : Math.max(3, computeDefaultRadius(n) - 1))
        .attr('opacity', n => focus.has(n.id) ? 1 : 0.25)

      labels.transition().duration(120)
        .attr('opacity', n => focus.has(n.id) ? 1 : 0.25)

      link.transition().duration(120)
        .attr('opacity', L => {
          const sid = nodeId(L.source), tid = nodeId(L.target)
          return (sid === targetNode.id || tid === targetNode.id) ? 0.9 : 0.15
        })
        .attr('stroke', L => defaultLinkStroke(L))
    }

    function resetHoverHighlight() {
      circles.transition().duration(120).attr('r', n => computeDefaultRadius(n)).attr('opacity', 1)
      labels.transition().duration(120).attr('opacity', 1)
      link.transition().duration(120).attr('opacity', 1).attr('stroke', L => defaultLinkStroke(L))
    }

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y)
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    function handleResize() {
      const size = getSize()
      width = size.w; height = size.h
      svg.attr('viewBox', `0 0 ${width} ${height}`)
      simulation.force('center', d3.forceCenter(width / 2, height / 2))
      simulation.alpha(0.3).restart()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      simulation.stop()
      window.removeEventListener('resize', handleResize)
      const tip = document.getElementById('d3-viz-tooltip')
      if (tip) tip.remove()
    }
  // selectedTags is a Set — identity changes on every update from SearchPage, so this is correct
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, selectedTags, layoutMode, weightMode, linkMode, weightingEnabled, impact])

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}

function nodeId(n: number | GraphNode): number {
  return typeof n === 'object' ? n.id : n
}
