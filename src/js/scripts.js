$(document).ready(function () {
    $(document).on("click", ".arrow-up", function () {
        var input = $(this).closest(".number-input-group").find(".number-input");
        var maxValue = input[0].max;
        var inputValue = input.val();
        if (inputValue < maxValue) {
            $(this).closest(".number-input-group").find(".number-input").val(inputValue * 1 + 1);
        }
    });
    $(document).on("click", ".arrow-down", function () {
        var input = $(this).closest(".number-input-group").find(".number-input");
        var inputValue = input.val();
        if(inputValue > 0) {
            $(this).closest(".number-input-group").find(".number-input").val(inputValue * 1 - 1);
        }
    });
});