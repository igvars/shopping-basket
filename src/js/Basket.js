var Basket = (function(){

    var containerElement = ".basket-container";
    var templateElement = "#basket-items-template";

    var items = {items:[],totalPrice:0,totalCount:0};
    function setCookie(name, value) {
        document.cookie = name + "=" + value;
    }
    function getCookie(name) {
        var r = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
        if (r) return r[2];
        else return "";
    }
    return {
        init: function(){
            this.getData();
            this.render(items);
            this.event();
            $(window).on('addToBasket', function(e, data){
                var post_id = data.post_id;
                var count = data.count;
                Basket.add(post_id, count);
                Basket.render(items);
            });
        },
        add: function (post_id, count) {
            var post  = Post.getPostForBasket(post_id);
            if(post) {
                var i = this.checkList(post.id);
                if (i) {
                    items.items[i].quantity = post.quantity;
                    if (count > post.quantity - items.items[i].count) {
                        count = post.quantity - items.items[i].count;
                    }
                    items.items[i].count = items.items[i].count * 1 + count * 1;
                    items.items[i].itemPrice = this.countPrice(post.price, items.items[i].count);
                } else {

                    var last_index = items.items.length;

                    items.items[last_index] = {};
                    items.items[last_index].id = post.id;
                    items.items[last_index].title = post.title;
                    items.items[last_index].quantity = post.quantity;
                    if (count > post.quantity) {
                        count = post.quantity;
                    }
                    items.items[last_index].count = count;
                    items.items[last_index].itemPrice = this.countPrice(post.price, count);
                }

                this.commit();
            }
        },
        remove: function (index) {
            items.items.splice(index, 1);

            this.commit();
        },
        countPrice: function (itemPrice, itemCount) {
            var price = new Decimal(itemPrice);
            var count = new Decimal(itemCount);
            var sum = price.mul(count);
            return sum.toNumber();
        },
        countTotalPrice: function () {
            var sum = new Decimal(0);
            for(var i in items.items) {
                if(items.items.hasOwnProperty(i)) {
                    var price = new Decimal(items.items[i].itemPrice);
                    sum = sum.plus(price);
                }
            }
            items.totalPrice = sum;
        },
        countTotalCount: function () {
            items.totalCount = items.items.length;
        },
        changeItemCount: function (item_id, action) {
            var index = this.checkList(item_id);
            var post = Post.getPostForBasket(item_id);
            if(action == "remove") {
                items.items[index].count = items.items[index].count-1;
                items.items[index].itemPrice = Basket.countPrice(post.price, items.items[index].count);
                if(items.items[index].count == 0) {
                    this.remove(index);
                }
                this.commit();
            }
            if(action == "add") {
                this.add(post.id,1);
            }
            this.render(items);
        },
        checkList: function (post_id) {
            for(var i in items.items) {
                if(items.items.hasOwnProperty(i)) {
                    if (items.items[i].id == post_id) {
                        return i;
                    }
                }
            }
            return false;
        },
        getData: function(){
            var rawItems = getCookie("shoppingBasket");
            if(rawItems) {
                rawItems = JSON.parse(getCookie("shoppingBasket"));
                for (var i in rawItems) {
                    if(rawItems.hasOwnProperty(i)) {
                        this.add(rawItems[i].id, rawItems[i].count);
                        $(window).trigger('addItem', {post_id: rawItems[i].id, count: rawItems[i].count});
                    }
                }
            }
        },
        render: function(data){
            var template = Handlebars.compile( $(templateElement).html() );
            $(containerElement + " div").remove();
            $(containerElement).append( template(data) );
        },
        commit: function () {
            this.countTotalCount();
            this.countTotalPrice();
            setCookie("shoppingBasket",JSON.stringify(items.items));
        },
        fetchBasketData: function () {
            var result = [];
            for(var i in items.items) {
                if(items.items.hasOwnProperty(i)) {
                    result[i] = {
                        id:items.items[i].id,
                        count:items.items[i].count
                    }
                }
            }
            return result;
        },
        event: function(){
            $(document).on("click", ".basket .arrow-down", function () {
                var id = $(this).closest("li").data('item-id');
                Basket.changeItemCount(id,"remove");
                $(window).trigger('removeItem', {post_id: id, count: 1});
            });
            $(document).on("click", ".basket .arrow-up", function () {
                var id = $(this).closest("li").data('item-id');
                Basket.changeItemCount(id,"add");
                $(window).trigger('addItem', {post_id: id, count: 1});
            });
        }
    }
})();