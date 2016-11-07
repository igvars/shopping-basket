var Order = (function(){
    return {
        init: function(){
            this.event();
        },
        /**
         * Create module events
         */
        event: function(){
            $('#sort-select').on("change", function(){
                var order = $(this).val();
                $(window).trigger('changeOrder', {order: order});
            });
        }
    }
})();