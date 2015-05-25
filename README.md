# lukemadera:subpages

Steps / Wizard for combining multiple pages / templates into a series of sub pages.

Has (optional / customizable) header with page title and next and previous arrows as well as clickable progress bar to show all steps and allow navigating to a specific one.

Javascript API also allows navigating forward or backward or to a specific page (by array index or key name) so this can be used with custom elements (i.e. a form submit button) to trigger going to the next / a specific page.


## Why?

It's a bit less opinionated than other steps / wizards packages which tend to be tied to forms specifically. This steps / subpages / wizard can be used with forms but can just as easily be used without forms. So for example, the same (or similar) code / display can be used for admins to edit form inputs and for non-admins to view the pages. Or it can be used separate from forms entirely (basically can display any content you set in the template).


## Demo

[Demo](http://beteal.org/org-edit)

[Source](https://github.com/lukemadera/beteal/tree/master/organization/org-edit)


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
        // showHeader: false,
        // showProgress: false
      };
    }
  });
}
```

Then style as needed (see the .less files for class names / styles to customize / override)


### API

```js
/**
@param {String} direction One of 'prev', 'next'
@param {Object} params
  @param {Object} [instid] The opts.instid passed in with the template options
@return {Object}
  @param {Boolean} valid True if went to the prev or next page (will be false if at beginning or end already)
*/
var retNav =lmSubpages.nav(direction, params);


/**
@param {Object} pageInfo
  @param {Number} [index] The page index to go to (best for performance)
  @param {String} [key] The page key to go to
@param {Object} params
  @param {Object} [instid] The opts.instid passed in with the template options
*/
lmSubpages.goToPage(pageInfo, params);
```