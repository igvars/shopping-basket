var Post = (function(){
    var self = this;
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
            });
            $(window).on('removeItem', function(e, data){
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
                if(category_id && products.products[i].category_id != category_id) {
                    delete products.products[i];
                    continue;
                }
                for (var j in galleries.galleries) {
                    if (products.products[i].gallery_id == galleries.galleries[j].id) {
                        products.products[i].images = galleries.galleries[j].images;
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
                if(posts.products[i].id == post_id) {
                    post = posts.products[i];
                    break;
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

                var id = $(this).data('post-id');

                $(window).trigger('clickPost', {id: id});
            });
            $(document).on("click", ".post .button-buy-group", function () {
                var post = $(this).closest(".post");
                var id = post.data('post-id');
                var count = post.find(".number-input").val();
                post.find(".number-input")[0].max -= post.find(".number-input").val();
                var maxCount = post.find(".number-input")[0].max;
                if(maxCount <= 0) {
                    post.find(".number-input")[0].max = 0;
                    post.find(".number-input")[0].disabled = true;
                    post.find(".bottom-block").addClass("unavailable");
                    post.find(".number-input").val(0);
                }
                $(window).trigger('addToBasket', {post_id: id,count: count});
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