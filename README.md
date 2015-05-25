# lukemadera:subpages

Steps / Wizard for combining multiple pages / templates into a series of sub pages.


## Demo

[Demo](http://beteal.org/org-edit)

[Source](https://github.com/lukemadera/meteor-packages/tree/master/subpages/basic)


## Dependencies

- [bower less-flexbox](https://github.com/jackrabbitsgroup/less-flexbox)


## Installation

In a Meteor app directory:
```bash
meteor add lukemadera:subpages
```


## Usage

```html
{{> lmSubpages pages=subpages opts=optsSubpages}}
```

```js
if(Meteor.isClient) {
  Template.subpagesBasic.helpers({
    subpages: function() {
      var subpages =[
        {
          title: "Basic",
          template: "orgEditBasic"
        },
        {
          key: "locations",   //set a unique key for referencing later (i.e. to nav / go to this page)
          title: "Locations",
          template: "orgEditLocations"
        },
        {
          title: "Tags",
          template: "orgEditTags",
          link: "org-edit/tags?orgId=orgid1"   //if a link is set, will route to this page INSTEAD of just setting a template (recommended for deep linking). NOTE: if you need to carry through any URL parameters, make sure to set them here to pass them through!
        }
      ];
      return subpages;
    },
    optsSubpages: function() {
      return {
        instid: 'orgEdit1',    //required - use this to pass in with any api calls to get the proper template instance
        // contents: true   //if true will prepend a contents page as the first subpage
        // //set custom templates
        // templates: {
        //   headerPrev: 'lmSubpagesHeaderPrev',
        //   headerNext: 'lmSubpagesHeaderNext'
        // },
        // defaultPageKey: 'basic',   //the page to start on (by key)
        // defaultPageIndex: 1    //the page to start on (by index)
      };
    }
  });
}
```

Then style as needed.
Can include the `subpages.import.less` file for default styles.


### API

```js
/**
@param {String} direction One of 'prev', 'next'
@param {Object} params
  @param {Object} [templateInst] One of 'templateInst' or 'instid' is required
  @param {Object} [instid] One of 'templateInst' or 'instid' is required
@return {Object}
  @param {Boolean} valid True if went to the prev or next page (will be false if at beginning or end already)
*/
var retNav =lmSubpages.nav(direction, params);


/**
@param {Object} pageInfo
  @param {Number} [index] The page index to go to (best for performance)
  @param {String} [key] The page key to go to
@param {Object} params
  @param {Object} [templateInst] One of 'templateInst' or 'instid' is required
  @param {Object} [instid] One of 'templateInst' or 'instid' is required
*/
lmSubpages.goToPage(pageInfo, params);
```