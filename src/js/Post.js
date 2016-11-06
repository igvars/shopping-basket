var Post = (function(){
    var containerElement = ".posts";
    var templateElement = "#post-template";

    var products = "";
    var galleries = "";
    var category_id = "";
    var order = "";
    return {
        init: function(){
            Post.getData();

            $(window).on('clickCategory', function(e, data){
                category_id = data.id;
                Post.getData(category_id, order);
            });
            $(window).on('changeOrder', function(e, data){
                order = data.order;
                Post.getData(category_id, order);
            });
            $(window).on('addItem', function(e, data){
                Post.reduceMaxQuantity(data.post_id, data.count)
            });
            $(window).on('removeItem', function(e, data){
                Post.increaseMaxQuantity(data.post_id, data.count)
            });
        },
        getData: function(category_id, order){
            $.ajax({
                url: "data/products.json",
                dataType: "json",
                async: false,
                success: function (response) {
                    products = response;
                }
            });
            $.ajax({
                url: "data/galleries.json",
                dataType: "json",
                async: false,
                success: function (response) {
                    galleries = response;
                }
            });

            for (var i in products.products) {
                if(products.products.hasOwnProperty(i)) {
                    if (category_id && products.products[i].category_id != category_id) {
                        delete products.products[i];
                        continue;
                    }
                    for (var j in galleries.galleries) {
                        if(galleries.galleries.hasOwnProperty(j)) {
                            if (products.products[i].gallery_id == galleries.galleries[j].id) {
                                products.products[i].images = galleries.galleries[j].images;
                            }
                        }
                    }
                }
            }
            if(order == "asc") {
                products.products.sort(
                    function(a, b) {
                        return a.price - b.price
                    }
                );
            } else if(order == "desc") {
                products.products.sort(
                    function(a, b) {
                        return b.price - a.price
                    }
                );
            }
            this.render(products);
        },
        getPostForBasket: function (post_id) {
            var posts = "";
            $.ajax({
                url: "data/products.json",
                dataType: "json",
                async: false,
                success: function (response) {
                    posts = response;
                }
            });
            var post = false;
            for(var i in posts.products) {
                if(posts.products.hasOwnProperty(i)) {
                    if (posts.products[i].id == post_id) {
                        post = posts.products[i];
                        break;
                    }
                }
            }
            return post;
        },
        render: function(data){

            var template = Handlebars.compile( $(templateElement).html() );
            $(containerElement + " div").remove();
            $(containerElement).append( template(data) );
            
            $('.slider-for').each(function(key, item) {

                var sliderIdName = 'slider' + key;
                var sliderNavIdName = 'sliderNav' + key;

                this.id = sliderIdName;
                $('.slider-nav')[key].id = sliderNavIdName;

                var sliderId = '#' + sliderIdName;
                var sliderNavId = '#' + sliderNavIdName;

                $(sliderId).slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: sliderNavId
                });

                $(sliderNavId).slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots: false,
                    focusOnSelect: true,
                    arrows: true,
                    variableWidth: true,
                    prevArrow: "<div class='button-prev'><img src='src/images/arrow-left.png' alt=''></div>",
                    nextArrow: "<div class='button-next'><img src='src/images/arrow-right.png' alt=''></div>",
                    asNavFor: sliderId
                });

            });

            this.event();
        },
        increaseMaxQuantity: function (post_id, count) {
            var i = this.checkList(post_id);
            if(i) {
                var post = products.products[i];
                post.quantity += count;
                this.render(products);
            }
        },
        reduceMaxQuantity: function (post_id, count) {
            var i = this.checkList(post_id);
            if(i) {
                var post = products.products[i];
                post.quantity -= count;
                if(post.quantity < 0) {
                    post.quantity = 0;
                }
                this.render(products);
            }
        },
        checkList: function (post_id) {
            for(var i in products.products) {
                if(products.products.hasOwnProperty(i)) {
                    if (products.products[i].id == post_id) {
                        return i;
                    }
                }
            }
            return false;
        },
        event: function(){

            $(document).on("click", ".post", function () {
                var self = $(this);
                if(self.hasClass("active")) {
                    return false
                }
                $.each($(".active"), function () {
                    $(this).removeClass("active");
                });
                self.addClass("active");
            });
            $(document).on("click", ".post .button-buy-group", function () {
                var id = $(this).closest(".post").data('post-id');
                var count = $(this).closest(".post").find(".number-input").val();
                if(count > 0) {
                    Post.reduceMaxQuantity(id, count);
                    $(window).trigger('addToBasket', {post_id: id, count: count});
                }
            });
            $(document).on("click", ".post .arrow-up", function () {
                var input = $(this).closest(".number-input-group").find(".number-input");
                var maxValue = input[0].max;
                var inputValue = input.val();
                if (inputValue < maxValue) {
                    $(this).closest(".number-input-group").find(".number-input").val(inputValue * 1 + 1);
                }
            });
            $(document).on("click", ".post .arrow-down", function () {
                var input = $(this).closest(".number-input-group").find(".number-input");
                var inputValue = input.val();
                if(inputValue > 0) {
                    $(this).closest(".number-input-group").find(".number-input").val(inputValue * 1 - 1);
                }
            });
        }
    }
})();