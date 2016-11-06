var App = (function(){
    return {
        init: function(){
            Basket.init();
            Order.init();
            Category.init();
            Post.init();
        }
    }
})();
App.init();