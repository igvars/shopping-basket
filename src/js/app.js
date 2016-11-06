var App = (function(){
    return {
        init: function(){
            Order.init();
            Category.init();
            Post.init();
            Basket.init();
        }
    }
})();
App.init();