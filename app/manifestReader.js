define(['jsonReader'], function (jsonReader) {

    function readManifest() {
        return jsonReader.read('manifest.json');
    }

    return {
        readManifest: readManifest,
    };

});