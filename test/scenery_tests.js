(function () {
  'use strict';

  /* jslint browser: true, nomen: true, indent: 2, white: true */
  /* global mocha,chai,Scenery,describe,before,beforeEach */

  mocha.setup('bdd');

  var expect = chai.expect;

  describe('Scenery', function () {
    var ele = document.getElementById('mock_scenery');

    ////////////////////////////////////////////////////////////////////////////
    // Constructor
    describe('constructor', function () {

      it('will set the scenes', function () {
        var scenery = new Scenery(ele);
        expect(scenery._scenes).to.be.an('array');
      });

      describe('id argument', function () {

        it('is required', function () {
          var fn = function () { new Scenery(); };
          expect(fn).to.throw(TypeError);
        });

        it('will use document.getElementById if id is a string', function () {
          var scenery = new Scenery(ele.getAttribute('id'));

          expect(scenery._container).to.equal(ele);
        });

        it('will use the passed element if id is an element', function () {
          var scenery = new Scenery(ele);

          expect(scenery._container).to.equal(ele);
        });
      });

      describe('settings argument', function () {
        it('has default values', function () {
          var scenery = new Scenery(ele);
          expect(scenery.settings).to.be.an('object');
        });

        it('can be set', function () {
          var prop = 'sequenced_in_class_name',
              value = 'test',
              test_settings = {},
              scenery;

          test_settings[prop] = value;

          scenery = new Scenery(ele, test_settings);

          expect(scenery.settings[prop]).to.equal(value);
        });
      });
    });

    ////////////////////////////////////////////////////////////////////////////
    // setScenes

    describe('#setScenes', function () {
      var scenery;

      before(function () {
        scenery = new Scenery(ele);
      });

      it('creates an array of scenes based on the child elements', function () {
        expect(scenery._scenes).to.be.an('array');
      });

      it('lumps together elements that share the same scene', function () {
        var totalScenes = ele.querySelectorAll('[data-scenery-scene]').length;

        expect(scenery._scenes.length).to.not.equal(totalScenes);
        expect(scenery._scenes[0]).to.be.an('array');
      });

      it('orders elements in an scene by sequence', function () {
        function sequence(ele) {
          return parseInt(ele.getAttribute('data-scenery-sequence'), 10);
        }

        expect( sequence(scenery._scenes[0][0]) ).to.be.lessThan( sequence(scenery._scenes[0][1]) );
      });
    });

    ////////////////////////////////////////////////////////////////////////////
    // begin

    describe("#begin", function () {
      var scenery;

      beforeEach(function () {
        scenery = new Scenery(ele);
      });

      it('fires a scenery:began event with an event detail that contains sceneIndex', function (done) {
        var spy;

        function callback (e) {
          ele.removeEventListener('scenery:began', spy);
          expect(spy).to.have.been.called();
          expect(e.detail.sceneIndex).to.be.a('number');
          done();
        }

        spy = chai.spy(callback);

        ele.addEventListener('scenery:began', spy, false);

        scenery.begin();
      });
    });

    ////////////////////////////////////////////////////////////////////////////
    // Private methods
    describe("Private Methods", function () {

      describe("#_order_ele_array_by_attributes", function () {
        var order_ele_array,
            eleA,
            eleB,
            eleC;

        before(function () {
          order_ele_array = Scenery.prototype._order_ele_array_by_attribute;
          eleA = document.createElement('div');
          eleB = document.createElement('div');
          eleC = document.createElement('div');

          eleA.className = "foo";
          eleB.className = "bar";
        });

        it("will sort an array of elements", function () {
          var eles = order_ele_array([eleA, eleB, eleC], 'class');
          expect(eles[0]).to.equal(eleB);
        });

        it("can accept a default value for an attribute", function () {
          var eles = order_ele_array([eleA, eleB, eleC], 'class', 'a');
          expect(eles[0]).to.equal(eleC);
          expect(eles[1]).to.equal(eleB);
        });

        it("cannot accept a NodeList", function () {
          var fn = function () { order_ele_array(ele.children, 'class'); };

          expect(fn).to.throw(TypeError);
        });
      });

      describe("#_extend_object", function () {
        var ext_obj;

        before(function () {
          ext_obj = Scenery.prototype._extend_object;
        });


        it("extends an object", function () {
          var extension = ext_obj({ foo: 'bar', baz: 'qux' }, { foo: 'test' });

          expect(extension.foo).to.equal('test');
          expect(extension.baz).to.equal('qux');
        });
      });

      describe("#_emit_event", function () {
        var emit,
            testEle;

        before(function () {
          emit = Scenery.prototype._emit_event;
          testEle = document.createElement('div');
        });

        it("can emit a custom event", function (done) {
          var spy;

          function callback () {
            testEle.removeEventListener('myCustomEvent', spy);
            expect(spy).to.have.been.called();
            done();
          }

          spy = chai.spy(callback);

          testEle.addEventListener('myCustomEvent', spy, false);
          emit(testEle, 'myCustomEvent');
        });

        it("can emit a custom event with a detail object", function (done) {
          var spy;

          function callback (e) {
            testEle.removeEventListener('myCustomEvent', spy);
            expect(spy).to.have.been.called();
            expect(e.detail.foo).to.equal('bar');
            done();
          }

          spy = chai.spy(callback);

          testEle.addEventListener('myCustomEvent', spy, false);
          emit(testEle, 'myCustomEvent', { foo: 'bar' });
        });
      });
    });
  });

  mocha.run();
}());
