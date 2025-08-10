---
layout: default
title: Composants
permalink: /components/
---

<div class="content w-full md:w-4/5 h-full overflow-scroll">
  <div class="recipes mb-24 py-8">
    <h2 class="text-red-950 md:text-primary uppercase font-semibold mb-2 px-6">{{ site.translation[site.language].components }}</h2>

    <div class="grid px-6 h-full grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {% assign sorted_components = site.components | sort: "title" %}
      {% for component in sorted_components %}
        <a class="recipe md:hover:scale-105 md:hover:rotate-1 transition" href="{{ component.url | prepend: site.baseurl }}">
          <canvas class="aspect-video w-full rounded-xl bg-gray-100 mb-1 bg-cover bg-center"{% for image in component.image %} style="background-image:url({{site.baseurl}}/images/{{ image }});"{% endfor %}></canvas>
          <h1 class="font-semibold leading-tight">{{ component.title }}</h1>
        </a>
      {% endfor %}
    </div>
  </div>
</div>
