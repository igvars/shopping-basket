var Category = (function(){

    var url = "data/categories.json";
    var containerElement = ".category-list";
    var templateElement = "#category-list-template";
    var self = this;
    var response = "";
    return {
        init: function(){
            this.getData(url);
        },
        /**
         * Get categories from remote json
         */
        getData: function(url){
            $.ajax({
                url: url,
                dataType: "json",
                async: false,
                success: function (response) {
                    self.response = response;
                }
            });
            this.render();
        },
        /**
         * Render category list
         */
        render: function(){

            var template = Handlebars.compile( $(templateElement).html() );
            $(containerElement).append( template(self.response) );

            this.event();
        },
        /**
         * Create module events
         */
        event: function(){

            $('.category-list a').click(function(e){
                e.preventDefault();
                var id = $(this).data('category-id');

                $(window).trigger('clickCategory', {id: id});
            });
        }
    }
})();