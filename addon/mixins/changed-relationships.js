import Ember from 'ember';
import lodash from 'lodash/lodash';

const { Mixin } = Ember;
const { isEqual } = lodash;

export default Mixin.create({
  changedRelationships() {
    //ids are always undefined until initialized
    if (this.get('_internalModel.dataHasInitialized') === false) { return; }

    let relationships = {};

    this.eachRelationship((name, meta) => {
      const basePath = `_internalModel._relationships.initializedRelationships.${name}`;

      if (meta.kind === 'belongsTo') {
        let initialId = this.get(`${basePath}.canonicalMembers.list.firstObject.id`);
        let newId = this.get(`${name}.id`);

        if (initialId !== newId) {
          relationships[name] = [ initialId, newId ];
        }

      } else if (meta.kind === 'hasMany') {
        let initialIds = this.get(`${basePath}.canonicalMembers.list`).mapBy('id');
        let newIds = this.get(`${basePath}.members.list`).mapBy('id');

        if (isEqual(initialIds, newIds) === false) {
          relationships[name] = [ initialIds, newIds ];
        }
      }
    });

    return relationships;
  }
});