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
        render: function(){

            var template = Handlebars.compile( $(templateElement).html() );
            $(containerElement).append( template(self.response) );

            this.event();
        },
        event: function(){

            $('.category-list a').click(function(e){
                e.preventDefault();
                var id = $(this).data('category-id');

                $(window).trigger('clickCategory', {id: id});
            });
        }
    }
})();