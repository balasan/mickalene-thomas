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

export

function fetchItem(id, callback) {
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
                    var obj = {}
                    obj.id = item.id;
                    obj.tags = item.tags;
                    obj.title = item.data["work.title"].value[0].text;
                    obj.date = item.data["work.date"] ? item.data["work.date"].value : '';
                    obj.medium = item.data["work.medium"] ? item.data["work.medium"].value[0].text : null;

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
                // console.log(simple, 'item')
                callback(null, simple)
            })
    });
}

export

function fetchWork(callback) {
    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
        Api.form('everything')
            .ref(Api.master())
            .query(prismic.Predicates.at("document.type", "work")).pageSize(100).submit(function(err, response) {
                if (err) {
                    console.log(err);
                    callback();
                }
                var simple = [];
                console.log(response, 'prismic response')

                var i = 0;
                var totalPages = response.total_pages;

                for (i = 0; i < totalPages; i++) {

                    runPages(function(pages) {
                        function shuffle(array) {
                            var currentIndex = array.length,
                                temporaryValue, randomIndex;

                            while (0 !== currentIndex) {

                                randomIndex = Math.floor(Math.random() * currentIndex);
                                currentIndex -= 1;

                                temporaryValue = array[currentIndex];
                                array[currentIndex] = array[randomIndex];
                                array[randomIndex] = temporaryValue;
                            }

                            return array;
                        }

                        shuffle(pages)

                        callback(null, pages);
                    })

                    function runPages(pagesCallback) {
                        var pageArray = [];
                        prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
                            Api.form('everything')
                                .ref(Api.master())
                                .query(prismic.Predicates.at("document.type", "work")).pageSize(100).page(i).submit(function(err, response) {
                                    if (err) {
                                        console.log(err);
                                        callback();
                                    }
                                    console.log(response, 'page num ' + i + ' response')
                                    response.results.forEach(function(item, i) {


                                        var obj = {}
                                        obj.id = item.id;
                                        obj.tags = item.tags;
                                        obj.type = item.type;
                                        obj.title = item.data["work.title"].value[0].text;
                                        obj.date = item.data["work.date"] ? item.data["work.date"].value : '';
                                        obj.medium = item.data["work.medium"] ? item.data["work.medium"].value[0].text : null;

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


                                        pageArray.push(obj)
                                        if (i == response.results.length - 1) pagesCallback(pageArray);
                                    });
                                })
                        });
                    }
                }
            })
    });
}




export

function fetchWorkTags(callback) {
    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
        Api.form('everything')
            .ref(Api.master())
            .query(prismic.Predicates.at("document.type", "work")).pageSize(100).submit(function(err, response) {
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

export

function fetchNewsTags(callback) {
    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
        Api.form('everything')
            .ref(Api.master())
            .query(prismic.Predicates.at("document.type", "news")).pageSize(100).submit(function(err, response) {
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

                console.log(uniqueTags, 'newstags')
                callback(null, uniqueTags)
            })
    });
}