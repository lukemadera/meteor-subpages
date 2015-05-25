lmSubpages ={};
var lmSubpagesPrivate ={};

/**
//for external calls in, need to store reference to template instance to get the correct one so for EACH instance of this package / template, will store two values: a passed in instid (for external reference) as a key and that is an object with the internal template instance. This will allow going back and forth between the two and allow external interaction with the proper template instance.
@example
  lmSubpagesPrivate.inst ={
    'inst1': {
      templateInst: templateInst1
    },
    'inst2': {
      templateInst: templateInst2
    }
  };
*/
lmSubpagesPrivate.inst ={};

/**
@param {String} direction One of 'prev', 'next'
@param {Object} params
  @param {Object} [templateInst] One of 'templateInst' or 'instid' is required
  @param {Object} [instid] One of 'templateInst' or 'instid' is required
@return {Object}
  @param {Boolean} valid True if went to the prev or next page (will be false if at beginning or end already)
*/
lmSubpages.nav =function(direction, params) {
  var ret ={valid:false};

  var templateInst;
  if(params.templateInst) {
    templateInst =params.templateInst;
  }
  else if(params.instid) {
    if(lmSubpagesPrivate.inst[params.instid] !==undefined) {
      templateInst =lmSubpagesPrivate.inst[params.instid].templateInst;
    }
  }
  if(templateInst) {
    var curPageIndex =templateInst.curPage.get().pageIndex;
    var pages =templateInst.data.pages;
    if(direction ==='prev' && curPageIndex >0) {
      ret.valid =true;
      curPageIndex--;
    }
    else if(direction ==='next' && curPageIndex <(pages.length-1)) {
      ret.valid =true;
      curPageIndex++;
    }

    if(ret.valid) {
      this.goToPage({index:curPageIndex}, {templateInst:templateInst});
    }
  }
  return ret;
};

/**
@param {Object} pageInfo
  @param {Number} [index] The page index to go to (best for performance)
  @param {String} [key] The page key to go to
@param {Object} params
  @param {Object} [templateInst] One of 'templateInst' or 'instid' is required
  @param {Object} [instid] One of 'templateInst' or 'instid' is required
*/
lmSubpages.goToPage =function(pageInfo, params) {
  var templateInst =false;
  if(params.templateInst) {
    templateInst =params.templateInst;
  }
  else if(params.instid) {
    if(lmSubpagesPrivate.inst[params.instid] !==undefined) {
      templateInst =lmSubpagesPrivate.inst[params.instid].templateInst;
    }
  }
  if(templateInst) {
    var curPage =false;
    var oldPage =templateInst.curPage.get();
    var pages =templateInst.data.pages;
    if(pageInfo.index !==undefined) {
      curPage =pages[pageInfo.index];
    }
    else if(pageInfo.key !==undefined) {
      var ii;
      for(ii =0; ii<pages.length; ii++) {
        if(pages[ii].key !==undefined && pages[ii].key ===pageInfo.key) {
          curPage =pages[ii];
          break;
        }
      }
    }
    else {
      curPage =pages[0];
    }
    if(curPage) {
      if(curPage.link !==undefined) {
        var newUrl ='/'+curPage.link;
        //if same / first page, need to set template instead
        var curUrl =Iron.Location.get().pathname; //use pathname instead of path to remove the query string
        if(!oldPage || newUrl ===curUrl) {
          templateInst.curPage.set(curPage);
        }
        else {
          templateInst.curPage.set(curPage);    //need to use template anyway since router does NOT seem to actually reload anything; just changes url (which is actually all we want to happen anyway so I guess that works..)
          Router.go(newUrl);
        }
      }
      else if(curPage.template !==undefined) {
        templateInst.curPage.set(curPage);
      }
    }
  }
};



lmSubpagesPrivate.init =function(templateInst, params) {
  var self =this;
  //only do ONCE and do not do until pages is set!
  if(!templateInst.inited && templateInst.data.pages && templateInst.data.pages.length) {
    templateInst.inited =true;
    self.initOpts(templateInst, {});
    var opts =templateInst.opts.get();

    //push a contents template to the front
    var pages =templateInst.data.pages;
    
    var ii;
    if(opts.contents !==undefined && opts.contents) {
      var contentsPages =[], pushObj;
      for(ii =0; ii<pages.length; ii++) {
        if(pages[ii].title !=="Contents") {
          pushObj ={
            title: pages[ii].title,
            pageIndex: (ii+1)   //+1 since will be adding contents to front
          };
          if(pages[ii].key !==undefined) {
            pushObj.key =pages[ii].key;
          }
          if(pages[ii].template !==undefined) {
            pushObj.template =pages[ii].template;
          }
          else if(pages[ii].link !==undefined) {
            pushObj.link =pages[ii].link;
          }
          contentsPages.push(pushObj);
        }
      }
      pages.unshift({
        key: "contents",
        title: "Contents",
        template: "lmSubpagesContents",
        atts: {
          pages: contentsPages
        }
      });
    }

    for(ii =0; ii<pages.length; ii++) {
      pages[ii].pageIndex =ii;
      if(pages[ii].atts ===undefined) {
        pages[ii].atts ={};
      }
    }

    templateInst.data.pages =pages;

    var pp1 ={};
    if(opts.defaultPageKey !==undefined) {
      pp1.key =opts.defaultPageKey;
    }
    else if(opts.defaultPageIndex !==undefined) {
      pp1.index =opts.defaultPageIndex;
    }
    else {
      pp1.index =0;
    }
    lmSubpages.goToPage(pp1, {templateInst:templateInst});
  }
  else {
    //pages not set first time yet when called from rendered.. timing issue?
    setTimeout(function() {
      self.init(templateInst, params);
    }, 500);
  }
};

lmSubpagesPrivate.initOpts =function(templateInst, params) {
  var opts =templateInst.data.opts;
  if(opts ===undefined) {
    opts ={};
  }

  if(opts.instid) {
    lmSubpagesPrivate.inst[opts.instid] ={
      templateInst: templateInst
    };
  }
  else {
    console.error('subpages: opts.instid is required to use any external api calls');
  }

  var defaults ={
    contents: false,
    templates: {
      headerPrev: 'lmSubpagesHeaderPrev',
      headerNext: 'lmSubpagesHeaderNext'
    }
  };
  var xx;
  //extend
  for(xx in defaults) {
    if(opts[xx] ===undefined) {
      opts[xx] =defaults[xx];
    }
  }
  templateInst.opts.set(opts);
};

lmSubpagesPrivate.destroyPartial =function(templateInst, params) {
  templateInst.inited =false;

  templateInst.curPage.set(false);
  templateInst.opts.set({});
};

lmSubpagesPrivate.destroy =function(templateInst, params) {
  lmSubpagesPrivate.destroyPartial(templateInst, params);

  //remove instid id key
  var xx;
  for(xx in lmSubpagesPrivate.inst) {
    if(lmSubpagesPrivate.inst[xx].templateInst ===templateInst) {
      delete lmSubpagesPrivate.inst[xx];
      break;
    }
  }
};

lmSubpagesPrivate.getMainTemplate =function(params) {
  var view =Blaze.currentView;
  if(view.name !=="Template.lmSubpages") {
    //get parent template instance if not on correct one - http://stackoverflow.com/questions/27949407/how-to-get-the-parent-template-instance-of-the-current-template
    while (view && view.name !=="Template.lmSubpages") {
      view = view.parentView;
    }
  }
  return view.templateInstance();
};

Template.lmSubpages.created =function() {
  this.inited =false;

  this.curPage =new ReactiveVar(false);
  this.opts =new ReactiveVar({});
};

Template.lmSubpages.rendered =function() {
  lmSubpagesPrivate.init(this, {});
};

Template.lmSubpages.destroyed =function() {
  lmSubpagesPrivate.destroy(this, {});
};

Template.lmSubpages.helpers({
  opts: function() {
    return Template.instance().opts.get();
  },
  curPage: function() {
    return Template.instance().curPage.get();
  },
  hasPrevNextPage: function() {
    var ret ={
      prev: true,
      next: true
    };
    var curPage =Template.instance().curPage.get();
    var pages =Template.instance().data.pages;
    if(curPage.pageIndex ===0) {
      ret.prev =false;
    }
    if(curPage.pageIndex >=(pages.length-1)) {
      ret.next =false;
    }
    return ret;
  }
});

Template.lmSubpages.events({
  'click .lm-subpages-prev': function(evt, template) {
    lmSubpages.nav('prev', {templateInst:template});
  },
  'click .lm-subpages-next': function(evt, template) {
    lmSubpages.nav('next', {templateInst:template});
  },
  'click .lm-subpages-header-title': function(evt, template) {
    lmSubpages.goToPage({index:0}, {templateInst:template});
  }
});

Template.lmSubpagesContents.events({
  'click .lm-subpages-contents-page': function(evt, template) {
    var templateInst =lmSubpagesPrivate.getMainTemplate();
    lmSubpages.goToPage({index:this.pageIndex}, {templateInst:templateInst});
  }
});