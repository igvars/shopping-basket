$(document).ready(function () {
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
});