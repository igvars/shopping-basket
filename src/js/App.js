var App = (function(){
    return {
        /**
         * Initiate the App
         */
        init: function(){
            Basket.init();
            Order.init();
            Category.init();
            Post.init();
        }
    }
})();
App.init();