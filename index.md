---
layout: default
title: CanJS Meetups
---

# Welcome to CanJS Meetups

Here you can find a meetup near you as well as find videos and other materials from past meetups.  [Find a meetup near you](#cities), check out [what you might learn at a meetup](#content), or find out how to [get involved](#get_involved).

## Cities
{% for city in site.cities %}
- [{{ city.name }}](#sponsors-{{city.name | replace:' ','_' | replace:',','_' | replace:'-','_' | replace:'.','_' | downcase}}) [>>]({{city.site}}){% endfor %}

## Content

At meetups, we'll go over how to build things and use certain features of CanJS.  Here's what we've done in past meetups.

### 1: Building TodoMVC

Check out the video and follow along as Justin explains how to build TodoMVC in CanJS. This covers topics like two-way binding and building an application using `can.Component`.

<iframe width="100%" height="600" src="http://jsfiddle.net/jandjorgensen/EAFb5/embedded/{{"result,js,html,css"}}/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

<iframe width="100%" height="400" src="//www.youtube.com/embed/E9kEM9P0Lp8" frameborder="0"> </iframe>

## Sponsors
{% for city in site.cities %}
###[{{city.name}}]({{city.site}})
<div class="city">
</div>


{% comment %}
{% for organizer in city.organizers %}

#### Organizer: {{ organizer.name }}
<div class="organizer">
{% if organizer.photo %}
<img src="http://bitovi.github.io/canjsmeetup/images/organizers/{{organizer.photo}}" />
{% endif %}
<div class="description">{{ organizer.bio }}</div>
</div>
{% endfor %}

{% endcomment %}

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

###For People
If you're in the area of one of these meetups, the first thing to do is to signup for meetup.com and attend the event. If you want to give a talk on something or help plan future meetups, contact the organizer on the meetup page. If you need starter material or have questions, feel free to reach out to us for assistance.

If you don't live near one of these cities, create a new CanJS meetup! As long as you have an open-invite event, no matter how small, Bitovi will provide you montly workshop and training material. Once you get over 15 people coming to your meetup, someone from Bitovi will come out. If you are outside the US, we will also come out, but when we can schedule a few meetups at once in the general area.

###For Organizations
If you're part of a company that's using CanJS, you can sponsor the meetup by hosting the meetup or purchasing food and drink for attendees. Organizations can also start CanJS meetups.

Sponsor organizations get Bitovi's training and lecture material and their logo listed on the meetup page.