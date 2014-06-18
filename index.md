---
layout: default
title: CanJS Meetups
---

# Welcome to CanJS Meetups

Here you can find a meetup near you as well as find videos and other materials from past meetups.  [Find a meetup near you](#cities), check out [what you might learn at a meetup](#content), or find out how to [get involved](#get_involved).

## Cities
{% for city in site.cities %}
- [{{ city.name }}](#sponsors_and_organizers-{{city.name | replace:' ','_' | replace:',','_' | replace:'-','_' | replace:'.','_' | downcase}}) [{{"&gt;&gt;"}}]({{city.site}}){% endfor %}



## Meetup Content

At meetups, we&apos;ll go over how to build things and use certain features of CanJS.  Here&apos;s what we&apos;ve done in past meetups.

### Building TodoMVC

Check out the video and follow along as Justin explains how to build TodoMVC in CanJS. This covers topics like two-way binding and building an application using `can.Component`.

<iframe width="100%" height="500" src="http://jsfiddle.net/donejs/CRZXH/embedded/{{"result,js,html,css"}}/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

<iframe width="100%" height="400" src="//www.youtube.com/embed/E9kEM9P0Lp8" frameborder="0"> </iframe>

### Map and List

Here&apos;s a preview of what&apos;s happening in upcoming meetups.  Through building an ATM, we demonstrate using `can.Map` and `can.List` to model application state.

<iframe width="100%" height="500" src="http://jsfiddle.net/donejs/3PZ8g/embedded/{{"result,js,html,css"}}/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

<iframe width="100%" height="400" src="//www.youtube.com/embed/QP9mHyxZNiI" frameborder="0"> </iframe>

### Components

Here's an overview of can.Component and a hello world example:

<iframe width="100%" height="400" src="//www.youtube.com/embed/BM1Jc3lVUrk" frameborder="0"> </iframe>

The end of the hello world example:

<a class="jsbin-embed" href="http://jsbin.com/hotad/2/embed?js,output">JS Bin</a>

And, an in-depth treatment of each of can.Component's APIs:

<iframe width="100%" height="400" src="//www.youtube.com/embed/ogX765S4iuc" frameborder="0"> </iframe>

The [template](http://canjs.com/docs/can.Component.prototype.template.html) modal example:

<a class="jsbin-embed" href="http://jsbin.com/kapuh/1/embed?js,output">JS Bin</a>

The [scope](http://canjs.com/docs/can.Component.prototype.scope.html) fancy counter example:

<a class="jsbin-embed" href="http://jsbin.com/fayih/1/embed?js,output">JS Bin</a>

The [instantiate](http://canjs.com/docs/can.Component.html) cross binding example:

<a class="jsbin-embed" href="http://jsbin.com/jowav/2/embed?js,output">JS Bin</a>

Example showing using [events](http://canjs.com/docs/can.Component.prototype.events.html) to animate elements:

<a class="jsbin-embed" href="http://jsbin.com/niruw/2/embed?js,output">JS Bin</a>

The [helpers](http://canjs.com/docs/can.Component.prototype.helpers.html) `isEditing` example:

<a class="jsbin-embed" href="http://jsbin.com/soyev/1/embed?js,output">JS Bin</a>


## Sponsors and Organizers
{% for city in site.cities %}
###[{{city.name}}]({{city.site}})
<div class="city">
</div>


{% for organizer in city.organizers %}

#### Organizer: {{ organizer.name }}
<div class="organizer">
{% if organizer.photo %}
<img src="http://bitovi.github.io/canjsmeetup/images/organizers/{{organizer.photo}}" />
{% endif %}
<div class="description">{{ organizer.bio }}</div>
</div>
{% endfor %}

{% if city.sponsor %}
#### Sponsor: {{ city.sponsor.name }}
<div class="sponsor">
{% if city.sponsor.logo %}
<img src="http://bitovi.github.io/canjsmeetup/images/sponsors/{{city.sponsor.logo}}" />
{% endif %}
<div class="description">{{ city.sponsor.description }}</div>
</div>
{% endif %}

{% unless forloop.last %}
<hr style="clear:both"/>
{% endunless %}

{% endfor %}


## Get Involved

### For People
If you&apos;re in the area of one of these meetups, the first thing to do is to signup for meetup.com and attend the event. If you want to give a talk on something or help plan future meetups, contact the organizer on the meetup page. If you need starter material or have questions, feel free to reach out to us for assistance.

If you don&apos;t live near one of these cities, create a new CanJS meetup! As long as you have an open-invite event, no matter how small, Bitovi will provide you montly workshop and training material. Once you get over 15 people coming to your meetup, someone from Bitovi will come out. If you are outside the US, we will also come out, but when we can schedule a few meetups at once in the general area.

### For Organizations
If you&apos;re part of a company that&apos;s using CanJS, you can sponsor the meetup by hosting the meetup or purchasing food and drink for attendees. Organizations can also start CanJS meetups.

Sponsor organizations get Bitovi&apos;s training and lecture material and their logo listed on the meetup page.

### Contact Us

Contact us for meetup materials or further information at [contact@bitovi.com](mailto:contact@bitovi.com).
