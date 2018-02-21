import Ember from 'ember';
import Config from 'ember-routable-modal/configuration';

export default Ember.Service.extend({
    routing: Ember.inject.service('-routing'),
    routeName: null,
    appContainer: Ember.testing ? '#ember-testing' : 'body',
    activeListener: function() {
        if (typeof Ember.$ !== 'undefined') {
            Ember.$(this.get('appContainer'))[this.get('routeName') ? 'addClass' : 'removeClass'](Config.modalOpenBodyClassName);
        }
    }.observes('routeName'),
    init() {
        this._super(...arguments);

        if (typeof Ember.$ !== 'undefined' && typeof window !== 'undefined') {
            Ember.$(window).on('popstate.ember-routable-modal', () => {
                if (this.get('routeName') !== this.get('routing.router.currentRouteName')) {
                    this.set('routeName', null);
                }
            });
        }
    },
    willDestroy() {
        Ember.$(this.get('appContainer')).removeClass(Config.modalOpenBodyClassName);
        if (typeof Ember.$ !== 'undefined' && typeof window !== 'undefined') {
          Ember.$(window).off('popstate.ember-routable-modal');
        }
    },
    clear() {
        if (this.get('routeName')) {
            this.set('routeName', null);
        }
    },
    close() {
        const routerMain = this.get('routing.router');
        const routerLib = routerMain._routerMicrolib || routerMain.router;
        const handlerInfos = routerLib.state.handlerInfos;
        const currentController = handlerInfos[handlerInfos.length - 1]._handler.controller;

        this.set('routeName', null);

        if (currentController._isModalRoute) {
            const parentRoute = handlerInfos[handlerInfos.length - 2].name;

            routerLib.transitionTo(parentRoute);
        } else {
            const url = this.get('routing').generateURL(this.get('routing.currentRouteName'));

            routerLib.updateURL(url);
        }
    }
});
