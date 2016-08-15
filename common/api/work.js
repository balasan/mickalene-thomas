var prismic = require('express-prismic').Prismic;
var configuration = {

    apiEndpoint: 'https://mickalene-thomas.prismic.io/api',

    // -- Access token if the Master is not open
    // accessToken: 'xxxxxx',

    // OAuth
    // clientId: 'xxxxxx',
    // clientSecret: 'xxxxxx',

    // -- Links resolution rules
    // This function will be used to generate links to Prismic.io documents
    // As your project grows, you should update this function according to your routes
    linkResolver: function(doc, ctx) {
        return '/';
    }

};

prismic.init(configuration);

export function fetchItem(id, callback) {

    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {

        Api.form('everything')
            .ref(Api.master())
            .query(prismic.Predicates.at("document.id", id)).submit(function(err, response) {
                if (err) {
                    console.log(err);
                    callback();
                }
                var simple;

                response.results.forEach(function(item) {
                    console.log(item, 'fetchItem')
                    var obj = {}
                    obj.id = item.id;
                     obj.related = item.data['work.related_exhibition'] ? item.data['work.related_exhibition'].value.document.id : null;
                    obj.tags = item.tags;
                    obj.title = item.data["work.title"].value[0].text;
                    obj.date = item.data["work.date"] ? item.data["work.date"].value : '';
                    obj.medium = item.data["work.medium"] ? item.data["work.medium"].value[0].text : null;
                    console.log(item, 'fetchItem');
                    obj.video = item.data["work.video"] ? item.data['work.video'].value : null;

                    if (obj.video) {
                        console.log(obj.video);
                        var specificIndex = obj.video.indexOf('player.vimeo.com/video/');
                        var startSlice = specificIndex + 'player.vimeo.com/video/'.length;
                        var videoId = obj.video.slice(startSlice, startSlice+9);
                        var embedString = "<iframe  src='//player.vimeo.com/video/"+videoId+"?autoplay=1&amp;byline=0&amp;title=0&amp;badge=0&amp;portrait=0&amp;api=1&amp;player_id=iframe_pop_video' width='100%' height='100%' frameborder='0' webkitallowfullscreen='' mozallowfullscreen='' allowfullscreen=''></iframe>";
                        obj.video = embedString;
                    }

                    obj.image = {};
                    obj.image.main = {};
                    obj.image.main.dimensions = {};
                    obj.image.small = {};
                    obj.image.small.dimensions = {};
                    obj.image.medium = {};
                    obj.image.medium.dimensions = {};
                    obj.image.smaller = {};
                    obj.image.smaller.dimensions = {};

                    obj.image.main.url = item.data["work.image"].value.main.url;
                    obj.image.main.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                    obj.image.main.dimensions.width = item.data["work.image"].value.main.dimensions.width;


                    if (item.data["work.image"].value.main.dimensions.width < 500) {
                        obj.image.smaller.url = item.data["work.image"].value.main.url;
                        obj.image.smaller.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.smaller.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.smaller.url = item.data["work.image"].value.views.smaller.url;
                        obj.image.smaller.dimensions.height = item.data["work.image"].value.views.smaller.dimensions.height;
                        obj.image.smaller.dimensions.width = item.data["work.image"].value.views.smaller.dimensions.width;
                    }


                    if (item.data["work.image"].value.main.dimensions.width < 1000) {
                        obj.image.small.url = item.data["work.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.small.url = item.data["work.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.views.small.dimensions.width;
                    }

                    if (item.data["work.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["work.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.medium.url = item.data["work.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.views.medium.dimensions.width;
                    }


                    simple = obj
                });
                callback(null, simple)
            })
    });
}

export function fetchWork(callback) {
   var allWork = [];
   var workObj = {};

   function callbackFunc() {
     callback(null, [allWork, workObj]);
   }

    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
        Api.form('everything').ref(Api.master())
            .query(
                prismic.Predicates.at("document.type", "work")
        ).pageSize(20).submit(function(err, response) {
            if (err) {
                console.log(err);
                callback();
            }
            var totalPages = response.total_pages;
            pageLoop(totalPages)
        });
    });

    function pageLoop(totalPages) {
        var currentPage = 0;

        for (currentPage = 1; currentPage <= totalPages; currentPage++) {
            pageQuery(currentPage, totalPages);
        }
    }

    function pageQuery(currentPage, totalPages) {
        prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
            Api.form('everything')
                .ref(Api.master())
                .query(
                    prismic.Predicates.at("document.type", "work")
            ).page(currentPage).pageSize(20).submit(function(err, response) {
                if (err) {
                    console.log(err);
                    callback();
                }
                response.results.forEach(function(item, i) {
                    var obj = {};
                    obj.related = item.data['work.related_exhibition'] ? item.data['work.related_exhibition'].value.document.id : null;
                    obj.id = item.id;
                    obj.tags = item.tags;
                    obj.type = item.type;
                    obj.title = item.data["work.title"].value[0].text;
                    obj.date = item.data["work.date"] ? item.data["work.date"].value : new Date('2014');
                    obj.medium = item.data["work.medium"] ? item.data["work.medium"].value[0].text : null;
                    obj.video = item.data["work.video"] ? item.data['work.video'].value : null;
                    if (obj.video) {
                        var specificIndex = obj.video.indexOf('player.vimeo.com/video/');
                        var startSlice = specificIndex + 'player.vimeo.com/video/'.length;
                        var videoId = obj.video.slice(startSlice, startSlice+9);
                        var embedString = "<iframe  src='//player.vimeo.com/video/"+videoId+"?autoplay=1&amp;byline=0&amp;title=0&amp;badge=0&amp;portrait=0&amp;api=1&amp;player_id=iframe_pop_video' width='100%' height='100%' frameborder='0' webkitallowfullscreen='' mozallowfullscreen='' allowfullscreen=''></iframe>";
                        obj.video = embedString;
                    }

                    obj.image = {};
                    obj.image.main = {};
                    obj.image.main.dimensions = {};
                    obj.image.small = {};
                    obj.image.small.dimensions = {};
                    obj.image.medium = {};
                    obj.image.medium.dimensions = {};
                    obj.image.smaller = {};
                    obj.image.smaller.dimensions = {};

                    obj.image.main.url = item.data["work.image"].value.main.url;
                    obj.image.main.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                    obj.image.main.dimensions.width = item.data["work.image"].value.main.dimensions.width;


                    if (item.data["work.image"].value.main.dimensions.width < 500) {
                        obj.image.smaller.url = item.data["work.image"].value.main.url;
                        obj.image.smaller.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.smaller.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.smaller.url = item.data["work.image"].value.views.smaller.url;
                        obj.image.smaller.dimensions.height = item.data["work.image"].value.views.smaller.dimensions.height;
                        obj.image.smaller.dimensions.width = item.data["work.image"].value.views.smaller.dimensions.width;
                    }


                    if (item.data["work.image"].value.main.dimensions.width < 1000) {
                        obj.image.small.url = item.data["work.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.small.url = item.data["work.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.views.small.dimensions.width;
                    }

                    if (item.data["work.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["work.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.medium.url = item.data["work.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.views.medium.dimensions.width;
                    }

                    if (allWork.length > 0) {
                      var allIds = [];
                      allWork.forEach(function(work, v) {
                        allIds.push(work.id);
                        if (v == allWork.length - 1) {
                           if (allIds.indexOf(obj.id) < 0) {
                                allWork.push(obj);
                                workObj[obj.id] = obj;
                            }
                           if (currentPage == totalPages && i == response.results.length - 1) callbackFunc();
                        }
                      });
                    } else {
                      allWork.push(obj);
                      workObj[obj.id] = obj;
                      if (currentPage == totalPages && i == response.results.length - 1) callbackFunc();
                    }
                });
            })
        });
    }
}

export

function fetchWorkTags(callback) {
    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
        Api.form('everything')
            .ref(Api.master())
            .query(prismic.Predicates.at("document.type", "work")).pageSize(200).submit(function(err, response) {
                if (err) {
                    console.log(err);
                    done();
                }
                var tags = [];
                response.results.forEach(function(item) {
                    item.tags.forEach(function(tag) {
                        tags.push(tag)
                    })
                });

                var uniqueTags = [];

                tags.forEach(function(tag) {
                    if (uniqueTags.indexOf(tag) < 0) {
                        uniqueTags.push(tag)
                    }
                })

                callback(null, uniqueTags)
            })
    });
}

export function fetchNewsTags(callback) {
    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
        Api.form('everything')
            .ref(Api.master())
            .query(prismic.Predicates.at("document.type", "news")).pageSize(200).submit(function(err, response) {
                if (err) {
                    console.log(err);
                    done();
                }
                var tags = [];
                response.results.forEach(function(item) {
                    item.tags.forEach(function(tag) {
                        tags.push(tag)
                    })
                });

                var uniqueTags = [];

                tags.forEach(function(tag) {
                    if (uniqueTags.indexOf(tag) < 0) {
                        uniqueTags.push(tag)
                    }
                })

                callback(null, uniqueTags)
            })
    });
}

export function fetchExhibition(id, callback) {
   var allWork = [];
   var workObj = {};

   function callbackFunc() {
     callback(null, [allWork, workObj]);
   }

    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
        Api.form('everything').ref(Api.master())
            .query(
                prismic.Predicates.at("my.work.related_exhibition", id)
        ).pageSize(20).submit(function(err, response) {
            if (err) {
                console.log(err);
                callback();
            }
            var totalPages = response.total_pages;
            pageLoop(totalPages)
        });
    });

    function pageLoop(totalPages) {
        var currentPage = 0;

        for (currentPage = 1; currentPage <= totalPages; currentPage++) {
            pageQuery(currentPage, totalPages);
        }
    }

    function pageQuery(currentPage, totalPages) {
        prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
            Api.form('everything')
                .ref(Api.master())
                .query(
                   prismic.Predicates.at("my.work.related_exhibition", id)
            ).page(currentPage).pageSize(20).submit(function(err, response) {
                if (err) {
                    console.log(err);
                    callback();
                }
                response.results.forEach(function(item, i) {
                    var obj = {};
                     obj.related = item.data['work.related_exhibition'] ? item.data['work.related_exhibition'].value.document.id : null;
                    obj.id = item.id;
                    obj.tags = item.tags;
                    obj.type = item.type;
                    obj.title = item.data["work.title"].value[0].text;
                    obj.date = item.data["work.date"] ? item.data["work.date"].value : new Date('2014');
                    obj.medium = item.data["work.medium"] ? item.data["work.medium"].value[0].text : null;
                    obj.video = item.data["work.video"] ? item.data['work.video'].value : null;
                    if (obj.video) {
                        var specificIndex = obj.video.indexOf('player.vimeo.com/video/');
                        var startSlice = specificIndex + 'player.vimeo.com/video/'.length;
                        var videoId = obj.video.slice(startSlice, startSlice+9);
                        var embedString = "<iframe  src='//player.vimeo.com/video/"+videoId+"?autoplay=1&amp;byline=0&amp;title=0&amp;badge=0&amp;portrait=0&amp;api=1&amp;player_id=iframe_pop_video' width='100%' height='100%' frameborder='0' webkitallowfullscreen='' mozallowfullscreen='' allowfullscreen=''></iframe>";
                        obj.video = embedString;
                    }

                    obj.image = {};
                    obj.image.main = {};
                    obj.image.main.dimensions = {};
                    obj.image.small = {};
                    obj.image.small.dimensions = {};
                    obj.image.medium = {};
                    obj.image.medium.dimensions = {};
                    obj.image.smaller = {};
                    obj.image.smaller.dimensions = {};

                    obj.image.main.url = item.data["work.image"].value.main.url;
                    obj.image.main.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                    obj.image.main.dimensions.width = item.data["work.image"].value.main.dimensions.width;


                    if (item.data["work.image"].value.main.dimensions.width < 500) {
                        obj.image.smaller.url = item.data["work.image"].value.main.url;
                        obj.image.smaller.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.smaller.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.smaller.url = item.data["work.image"].value.views.smaller.url;
                        obj.image.smaller.dimensions.height = item.data["work.image"].value.views.smaller.dimensions.height;
                        obj.image.smaller.dimensions.width = item.data["work.image"].value.views.smaller.dimensions.width;
                    }


                    if (item.data["work.image"].value.main.dimensions.width < 1000) {
                        obj.image.small.url = item.data["work.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.small.url = item.data["work.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.views.small.dimensions.width;
                    }

                    if (item.data["work.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["work.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                    } else {
                        obj.image.medium.url = item.data["work.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.views.medium.dimensions.width;
                    }

                    if (allWork.length > 0) {
                      var allIds = [];
                      allWork.forEach(function(work, v) {
                        allIds.push(work.id);
                        if (v == allWork.length - 1) {
                           if (allIds.indexOf(obj.id) < 0) {
                                allWork.push(obj);
                                workObj[obj.id] = obj;
                            }
                           if (currentPage == totalPages && i == response.results.length - 1) callbackFunc();
                        }
                      });
                    } else {
                      allWork.push(obj);
                      workObj[obj.id] = obj;
                      if (currentPage == totalPages && i == response.results.length - 1) callbackFunc();
                    }
                });
            })
        });
    }
}
