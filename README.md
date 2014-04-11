scenery.js
================================================================================

scenery.js is an animation sequencing library that requires *no* JavaScript
configuration and *no* exterior libraries. All configuration is done via HTML
`data` attributes, and animations are handled with CSS transitions.
This makes scenery.js ideal for situations like HTML5 banners where sizes is
important and configuration via JavaScript can be tedious.

Getting started
---------------

To start, simply include scenery.js onto your page, typically in the `<head>` or
near the closing `</body>` tag.

Once scenery.js is on the page, simply set up your scene in your HTML.

```html
<div class="my-banner" data-scenery="main" data-scenery-delay-duration="3000">
  <p class="text" data-scenery-scene="1" data-scenery-animate-in="opacity: 0">I will hide first.</p>
  <p class="text" data-scenery-scene="2" data-scenery-animate-in="opacity: 0">I will hide second.</p>
  <p class="text" data-scenery-scene="2" data-scenery-animate-in="opacity: 0">I will hide last!</p>
</div>
```

Add a little CSS:

```css
.text {
  transition: opacity 500ms linear;
}
```

And then trigger it with JavaScript:

```javascript
var main = new Scenery('main');
main.begin();
```

### What's going on here?

First, we're initalizing a scene by looking for an element that is
declaring itself as a scenery with the `data-scenery` attribute. From there,
scenery.js stores the scenery's scenes into memory by looking for child elements
that are associating themselves with scenes. Finally, the `begin()` method 
begins the animation sequence by playing each scene in order and applies the CSS
included in the `data-scenery-animate-out` attribute when it's that element's
turn to animate.

After a scene has been sequenced and another scene is queued to play, Scenery
delays for as many miliseconds that are specified in
`data-scenery-delay-duration`.

Sequencing scenes
-----------------

In addition to sequencing scenes in a scenery, individual scenes can also be
sequenced. By default, when multiple elements are in the same scene, they
animate at the same time. By adding the `data-scenery-sequence` attribute to the
element, you can animate specific elements in order.

```html
<div class="my-banner" data-scenery="main" data-scenery-delay-duration="3000">
  <p data-scenery-scene="1" data-scenery-animate-in="opacity: 0">I will hide first.</p>
  <p data-scenery-scene="1" data-scenery-sequence="2" data-scenery-animate-in="opacity: 0">I will hide second, right after the first paragraph.</p>
  <p data-scenery-scene="2" data-scenery-animate-in="opacity: 0">I will hide last!</p>
</div>
```

In addition, multiple elements can share the same sequence within a scene. If
two or more elements share the same sequence, then their animation will trigger
at the same time. By default, all elements in a scene are on the first sequence.

Animations are handled with CSS
-------------------------------

We use CSS for animations because CSS _is_ where the animations should be
specified. scenery.js listens for `transitionend` events to be fired and
handles it accordingly. This allows your animations to be extremely
sophisticated if needed. Scenery also supports CSS animations _in addition_ to
CSS transitions. If that's the case, Scenery will listen for the `animationend`
event instead.

When it's an element's turn to animate, scenery.js will add the class
`scenery-animated-in` to it. When a element is ready to be sequenced out,
scenery.js will add a `scenery-animated-out` class to the element. If you didn't
want to use `data-scenery-animate-in` to determine what rules will be added, you
could simply add styles to the class instead.

```css
.text {
  opacity: 0;
  transition: opacity 500ms linear;
}
.text.scenery-animated-in {
  opacity: 1;
}
.text.scenery-animated-out {
  opacity: 0;
}
```

Browser Support
---------------

scenery.js uses CSS animations to perform animations. Because of this, IE9 and
below are not fully supported. By default, the CSS rules simply are applied
instantly. If you need animations, set the `data-scenery-animation-duration`
attribute on each element that will need to be animated and then listen to the
`scenery:sequenced` event that will be emitted from each element when it is
their turn to be animated. caniuse.com maintains lists of browsers that support
[CSS transitions](http://caniuse.com/css-transitions) and
[CSS animations](http://caniuse.com/css-animation).


HTML data-attribute methods
---------------------------

### Scenery elements

#### data-scenery="string"

Establishes the element as a Scenery. All elements that will be animated within
the scene much be a child of this element.

#### data-scenery-delay-duration="number"

The duration, in miliseconds, to wait between scene changes.

### Scene elements

#### data-scenery-scene="number"

Associates the element with a scene.

#### data-scenery-sequence="number"

**Default:** `1`

Associates the element with a sequence within a scene. All elements are animated
in order by their sequence. If multiple elements within a scene share the same
sequence, they will be animated at the same time.

#### data-scenery-animate-in="string"

**Default:** `""`

CSS rules to be applied when the scene starts playing. Treat this attribute like
a `style` attribute.

#### data-scenery-animate-out="string"

**Default:** `""`

CSS rules to be applied when the following scene starts playing. Treat this
attribute like a `style` attribute.

#### data-scenery-animation-duration="number"

**Default:** `""`

The number, in miliseconds, that the element will be animated for. This value is
only interpreted by browsers that do not support CSS animations or CSS
transitions. Please refer to the [Browser Support](#browser-support) section for
more details.

JavaScript Methods
------------------

In addition to the HTML `data`-attribute options, scenery.js offers a robust
JavaScript API.

### Constructor methods

#### new Scenery(name[, settings])

Initializes a new Scenery by searching the DOM for an element with a
`data-scenery` attribute equal to `name`. If an object is passed as the second
argument, then settings can be set. Please refer to the [settings instance 
attribute](#settings) for the list of settings that can be set.

**The Scenery element will emit a `scenery:initialized` event once the Scenery
object finishes initializing.**

### Instance methods

The methods listed below are available to all initialized Scenery objects.

#### begin([scene])

Begins the animation sequence from the first scene. If a number is passed as the
first argument, then the animation will begin from the scene that is equal to
the number.

**The Scenery element will emit a `scenery:began` event once the Scenery
begins.**

#### pause()

Pauses the animation sequence if it is currently running. If the Scenery is
paused in a middle of a sequence, then the sequence will complete and then 
the Scenery will pause.

**The Scenery element will emit a `scenery:paused` event once the sequence has
been paused.**

#### resume()

Resumes the animation sequence from the current point it was paused at.

**The Scenery element will emit a `scenery:resumed` event once the sequence
resumes playing.**

#### paused()

Returns `true` or `false`, depending on whether the animation sequence has been
paused or not.

#### currentScene()

Returns a number representing the index of the current scene.

#### elementsInScene(number)

Returns a NodeList of the elements within a specific scene. Returns `null` if
the scene does not exist.

#### end(playAnimations = false)

Ends a Scenery prematurely. If `playAnimations` is set to true, then all of the
elements will animate at once.

**The Scenery element will emit a `scenery:ended` event once the Scenery ends.**

#### destroy(removeElements = false)

Destroys a Scenery, but retains the HTML elements by default. If
`removeElements` is set to `true`, then it will destroy the associated Scenery
HTML element and it's child nodes as well.

**The Scenery element will emit a `scenery:destroyed` event once the Scenery is
destroyed. If the Scenery element is being removed from the DOM, then the event
will fire immediately before the element is removed.**

### Instance properties

The Scenery object's properties can be altered at any time once the Scenery
object has been initialized.

#### settings={}

The `settings` object can be edited. Any settings not set here will be inherited
by the Scenery's prototype, which contains the default values. The available
attributes are:

* `animation_triggered_class_name` - (_String_) The class name that will be
added to all animated elements.

JavaScript Events
-----------------

scenery.js is event-driven, so there are plenty of events to listen to.

### Scenery element

#### scenery:initialized

Emitted after the Scenery object is initialized.

#### scenery:destroyed

Emitted after the Scenery object is destroyed. If the Scenery element is going
to be removed from the DOM in addition, then the event will emit right before
the element is deleted.

#### scenery:began

Emitted after the Scenery object begins animating.

#### scenery:ended

Emitted after the Scenery object ends the animation sequence.

#### scenery:paused

Emitted when the Scenery animation sequence is paused.

#### scenery:resumed

Emitted when the Scenery animation sequence is resumed from a pause.

#### scenery:scene:changed

Emitted when the Scenery sequences to a new scene.

### Sequence elements

#### scenery:sequenced:in

Emitted when the element is sequenced in.

#### scenery:sequenced:out

Emitted when the element is sequenced out.

Contributing
------------

If you want to make any contributions, please fork this repo and create a pull
request with your patch. Please keep pull requests focused on one thing at a
time, so if you have multiple things you'd like to merge into the repository,
please create an individual pull request for each one.

Suggestions, feedback and bug reports
-------------------------------------

Bug reports and feature suggestions should be submitted to the Issues section of
this repository.

If you have any feedback, please contact
[@jakebellacera](http://twitter.com/jakebellacera) on Twitter.
