/*global JSNES updateBoard SCRIPT_ROOT MIDI*/
var nes;
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
$(function() {
    MIDI.loadPlugin({
        soundfontUrl: SCRIPT_ROOT + "/static/fonts/FluidR3_GM/",
        instruments: ["acoustic_grand_piano"],
        callback: function() {

            $('#loading').hide();

            window.MIDI = MIDI;
            MIDI.setVolume(0, 127);
            MIDI.noteOn(0, 60, 127);
            MIDI.noteOn(0, 60, 127);

        }
    });

    nes = new JSNES({
        'ui': $('#emulator').JSNESUI({
            'Working': [
                ['Super Mario Bros.', SCRIPT_ROOT + '/static/local-roms/Super Mario Bros. (JU) (PRG0) [!].nes']
            ]
        })
    });
    var sprites = {'mario': [[[188, 25, 0], 0, 0], [[188, 25, 0], 1, 0], [[188, 25, 0], 2, 0], [[188, 25, 0], 3, 0], [[188, 25, 0], 4, 0], [[188, 25, 0], 0, 1], [[188, 25, 0], 1, 1], [[188, 25, 0], 2, 1], [[188, 25, 0], 3, 1], [[188, 25, 0], 4, 1]],
                   'goomba': [[[177, 84, 0], 0, 0], [[177, 84, 0], 1, 0], [[177, 84, 0], 2, 0], [[177, 84, 0], 3, 0], [[177, 84, 0], 4, 0], [[177, 84, 0], 5, 0], [[177, 84, 0], 6, 0], [[177, 84, 0], 7, 0], [[177, 84, 0], 8, 0], [[177, 84, 0], 9, 0], [[177, 84, 0], 10, 0], [[177, 84, 0], 11, 0], [[177, 84, 0], 12, 0], [[177, 84, 0], 13, 0], [[177, 84, 0], 14, 0], [[177, 84, 0], 15, 0],
                              [[255, 209, 199], 5, 1], [[255, 209, 199], 6, 1], [[255, 209, 199], 7, 1], [[255, 209, 199], 8, 1], [[255, 209, 199], 9, 1], [[255, 209, 199], 10, 1],
                              [[255, 209, 199], 5, 2], [[255, 209, 199], 6, 2], [[255, 209, 199], 7, 2], [[255, 209, 199], 8, 2], [[255, 209, 199], 9, 2], [[255, 209, 199], 10, 2]],
                   'brick': [[[0, 0, 0], 0, 0], [[0, 0, 0], 1, 0], [[0, 0, 0], 2, 0], [[0, 0, 0], 3, 0], [[0, 0, 0], 4, 0], [[0, 0, 0], 5, 0], [[0, 0, 0], 6, 0], [[0, 0, 0], 7, 0],
                             [[177, 84, 0], 0, 1], [[177, 84, 0], 1, 1], [[177, 84, 0], 2, 1], [[177, 84, 0], 3, 1], [[177, 84, 0], 4, 1], [[177, 84, 0], 5, 1], [[177, 84, 0], 6, 1], [[0, 0, 0], 7, 1]],
                   'hole': [[[255, 209, 199], 0, 0], [[129, 121, 255], 2, 1], [[129, 121, 255], 2, 2], [[129, 121, 255], 2, 3]]

                  };
    var canvas = $('.nes-screen')[0],
        canvas_ctx = canvas.getContext('2d'),
        objectExtractor = $.objectExtractor({width: canvas.width,
                                             height: canvas.height,
                                             sprites: sprites});
    var viewer_canvas = document.getElementById('viewer'),
        viewer_canvas_ctx = viewer_canvas.getContext('2d'),
        viewer_canvas_data = viewer_canvas_ctx.createImageData(canvas.width, canvas.height);
    function tick() {
        var imageData = canvas_ctx.getImageData(0, 0, canvas.width, canvas.height),
            data = imageData.data,
            visual = getParameterByName('visual');
        var board = objectExtractor.getObjects(data, visual);
        updateBoard(board);
        if (visual) {
            $.each(board.object_data, function(i) {
                viewer_canvas_data.data[i] = this;
            });
            viewer_canvas_ctx.putImageData(viewer_canvas_data, 0, 0);
        }
        $('#objects').text(JSON.stringify(board.objects));
        setTimeout(tick, 200);
    }
    tick();
});