/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed     = Ember.computed;
const get          = Ember.get;
const set          = Ember.set;
const alias        = Ember.computed.alias;
const service      = Ember.inject.service;

const defaultRadix = 10;
const defaultBase  = 1024;
/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/



/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(NodeDriver, {
  driverName: '%%DRIVERNAME%%',
  config:     alias('model.%%DRIVERNAME%%Config'),
  app:        service(),

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'nodes/components/driver-%%DRIVERNAME%%/template'
    });
    set(this,'layout', template);

    this._super(...arguments);

  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  // Write your component here, starting with setting 'model' to a machine with your config populated
  bootstrap: function() {
    // bootstrap is called by rancher ui on 'init', you're better off doing your setup here rather then the init function to ensure everything is setup correctly
    let config = get(this, 'globalStore').createRecord({
      type: '%%DRIVERNAME%%Config',
      region: 'us-east-2',
      accessKey: '',
      secretKey: '',
      instanceType: '',
      cpuGen: 'v2',
      performance: '2',
      cpuCount: '1',
      memorySize: 1,
      sourceOmi: "",
      extraTagsAll: [],
      extraTagsInstances: []
    });
    set(this, 'model.%%DRIVERNAME%%Config', config);

    this.setProperties({
      cpuMin: 1,
      cpuMax: 78,
      ramMin: 1,
      ramMax: 1039,
      regionChoices: ["eu-west-2", "us-east-2", "us-west-1"],
      performanceChoices: [{"id": "1", "label": "Highest"},
                           {"id": "2", "label": "High"},
                           {"id": "3", "label": "Medium"}],
      cpuGenChoices: [{"id": "v2", "label": "Intel Ivy Bridge (v2)"}, 
                      {"id": "v3", "label": "Intel Haswell (v3)"}, 
                      {"id": "v4", "label": "Intel Broadwell (v4)"}, 
                      {"id": "v5", "label": "Intel Skylake (v5)"}
                    ],
    });
  },

  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    var errors = get(this, 'errors')||[];
    if ( !get(this, 'model.name') ) {
      errors.push('Name is required');
    }

    // Check something and add an error entry if it fails:
    if (!get(this, 'config.accessKey')) {
      errors.push('Access Key is required');
    }

    if (!get(this, 'config.secretKey')) {
      errors.push('Secret Key is required');
    }

    if (!get(this, 'config.region')) {
      errors.push('Region is required');
    }

    // Compute the instance type
    set(this, 'config.instanceType', "tina" + get(this, 'config.cpuGen') 
                                    + ".c" + get(this, 'config.cpuCount') 
                                    + "r" + get(this, 'config.memorySize') 
                                    + "p" + get(this, 'config.performance'));

    // Set the array of errors for display,
    // and return true if saving should continue.
    if ( get(errors, 'length') ) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  // Any computed properties or custom logic can go here
});
