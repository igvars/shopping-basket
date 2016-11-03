$(document).ready(function () {
    
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
});