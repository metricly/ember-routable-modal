import { click, currentURL, currentRouteName, find, findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import config from 'ember-routable-modal/configuration';

module('Acceptance | modals with synchronous models', function(hooks) {
  setupApplicationTest(hooks);

  function joinClasses(classes) {
    return `.${classes.join('.')}`;
  }

  test('transitioning to /model-one', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    try {
      await visit('/model-one');
    } catch (e) {
      // Caught TransitionAborted
    }
    assert.equal(currentURL(), '/model-one');
    assert.equal(currentRouteName(), 'index.model-one');
    assert.ok(findAll(joinClasses(config.modalClassNames)));
    assert.ok(find('#application-title'));
    assert.ok(find('#index-title'));
    assert.equal(find('#modal-model').textContent, 'instant');

    await click('.routable-modal--close');
    assert.equal(currentURL(), '/');
    assert.equal(currentRouteName(), 'index.index');
    assert.ok(find('#application-title'));
    assert.ok(find('#index-title'));
  });

  test('booting up from /model-one', async function(assert) {
    await visit('/model-one');

    assert.equal(currentURL(), '/model-one');
    assert.equal(currentRouteName(), 'index.model-one');
    assert.ok(findAll(joinClasses(config.modalClassNames)));
    assert.ok(find('#application-title'));
    assert.ok(find('#index-title'));
    assert.equal(find('#modal-model').textContent, 'instant');

    await click('.routable-modal--close');
    assert.equal(currentURL(), '/');
    assert.equal(currentRouteName(), 'index.index');
    assert.ok(find('#application-title'));
    assert.ok(find('#index-title'));
  });
});
