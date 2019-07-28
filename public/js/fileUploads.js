FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,
    FilePondPluginImageResize,
)
FilePond.setOptions({
    stylePanelAspectRatio: 50/100,
    imageResizeTargetWidth: 50,
    imageResizeTargetHeight: 100
})
FilePond.parse(document.body);