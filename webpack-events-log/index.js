function WebpackPluginDemo(options){
    this.options = options;
}

WebpackPluginDemo.prototype.apply = function(compiler){
    console.log('-> [init options]: Plugin options ------------------------');
    console.log(this.options);

    compiler.plugin('compile', function(params){
        console.log('-> [start compile]: The compiler is starting to compile...');
    });

    compiler.plugin('after-compile', function(Compilation, callback){
        console.log('-> [after compile]: The compiler has finish the compile...');
        callback();
    });

    compiler.plugin('compilation', function(compilation){
        console.log('-> [new compilation]: The compiler is starting a new compilation...');

        compilation.plugin('seal', function() {
            console.log('-> [start seal]: The sealing of the compilation has started...');
        });

        compilation.plugin('optimize', function() {
            console.log('-> [start optimize]: webpack is begining the optimization phase...');
        });

        compilation.plugin('optimize-tree', function(chunks, modules, callback) {
            console.log('-> [optimize tree]: webpack is begining the optimization tree...');
            callback();
        });

        compilation.plugin('optimize-modules', function(modules) {
            console.log('-> [optimize modules]: handle to the modules array during tree optimization...');
        });

        compilation.plugin('after-optimize-modules', function(modules) {
            console.log('-> [after optimize modules]: Optimizing the modules has finished...');
        });

        compilation.plugin('optimize-chunks', function(chunks) {
            console.log('-> [optimize chunks]: handle to the chunks array during tree optimization...');
        });

        compilation.plugin('after-optimize-chunks', function(chunks) {
            console.log('-> [after optimize chunks]: Optimizing the chunks has finished...');
        });

        compilation.plugin('revive-modules', function(modules, records) {
            console.log('-> [revive modules]: Restore module info from records...');
        });

        compilation.plugin('optimize-module-order', function(modules) {
            console.log('-> [optimize module order]: Sort the modules in order of importance...');
        });

        compilation.plugin('optimize-module-ids', function(modules) {
            console.log('-> [optimize module ids]: Optimize the module ids...');
        });

        compilation.plugin('after-optimize-module-ids', function(modules) {
            console.log('-> [after optimize module ids]: Optimizing the module ids has finished...');
        });

        compilation.plugin('record-modules', function(modules, records) {
            console.log('-> [record modules]: Store module info to the records...');
        });

        compilation.plugin('revive-chunks', function(chunks, records) {
            console.log('-> [revive chunks]: Restore chunk info from records...');
        });

        compilation.plugin('optimize-chunk-order', function(chunks) {
            console.log('-> [optimize chunk order]: Sort the chunks in order of importance...');
        });

        compilation.plugin('optimize-chunk-ids', function(chunks) {
            console.log('-> [optimize chunk ids]: Optimize the chunk ids...');
        });

        compilation.plugin('after-optimize-chunk-ids', function(chunks) {
            console.log('-> [after optimize chunk ids]: Optimizing the chunk ids has finished...');
        });

        compilation.plugin('record-chunks', function(chunks, records) {
            console.log('-> [record chunks]: Store chunk info to the records...');
        });

        compilation.plugin('before-hash', function() {
            console.log('-> [before hash]: Before the compilation is hashed...');
        });

        compilation.plugin('after-hash', function() {
            console.log('-> [after hash]: After the compilation is hashed...');
        });

        compilation.plugin('before-chunk-assets', function() {
            console.log('-> [before chunk assets]: Before creating the chunk assets...');
        });

        compilation.plugin('additional-chunk-assets', function(chunks) {
            console.log('-> [additional chunk assets]: Create additional assets for the chunks...');
        });

        compilation.plugin('record', function(compilation, records) {
            console.log('-> [record]: Store info about the compilation to the records...');
        });

        compilation.plugin('optimize-chunk-assets', function(chunks, callback) {
            console.log('-> [optimize chunk assets]: Optimize the assets for the chunks...');
            callback();
        });

        compilation.plugin('after-optimize-chunk-assets', function(chunks) {
            console.log('-> [after optimize chunk assets]: The chunk assets have been optimized...');
        });

        compilation.plugin('optimize-assets', function(assets, callback) {
            console.log('-> [optimize assets]: Optimize all assets...');
            callback();
        });

        compilation.plugin('after-optimize-assets', function(assets) {
            console.log('-> [after optimize assets]: The assets has been optimized...');
        });

        compilation.plugin('build-module', function() {
            console.log('-> [build module]: Before a module build has started...');
        });

        compilation.plugin('succeed-module', function() {
            console.log('-> [succeed module]: A module has been built successfully...');
        });

        compilation.plugin('failed-module', function() {
            console.log('-> [failed module]: The module build has failed...');
        });

        compilation.plugin('module-asset', function(module, filename) {
            console.log('-> [module asset]: An asset from a module was added to the compilation...');
        });

        compilation.plugin('chunk-asset', function(chunk, filename) {
            console.log('-> [chunk asset]: An asset from a chunk was added to the compilation...');
        });
    });

    compiler.plugin('emit', function(compilation, callback) {
        console.log('-> [emit files]: The compilation is going to emit files...');
        callback();
    });

    compiler.plugin('after-emit', function(compilation, callback) {
        console.log('-> [after emit files]: The compilation has finish to emit files...');
        callback();
    });

    compiler.plugin('done', function(stats) {
        console.log('-> [done]: The compilation is done...');
    });

    compiler.plugin('failed', function(err){
        console.log('-> [failed]: The compilation is failed...');
        console.log(err);
    });

    compiler.plugin('after-plugins', function(){
        console.log('-> [after-plugins]: The compilation is after plugins...');
    });

    compiler.plugin('after-resolvers', function(){
        console.log('-> [after-resolvers]: The compilation is after resolvers...');
    });
}

module.exports = WebpackPluginDemo;
