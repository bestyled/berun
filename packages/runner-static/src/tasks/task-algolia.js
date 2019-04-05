module.exports.taskAlgoliaDeploy = async function taskAlgoliaDeploy(berun) {
   
    var algoliasearch = require('algoliasearch');
    const client = algoliasearch(process.env.ALGOLIA_APPID, process.env.ALGOLIA_APIADMIN);

    // 1. Initialize the target and temporary indices
    const index = client.initIndex(process.env.ALGOLIA_INDEX);
    const tmpIndex = client.initIndex(`${process.env.ALGOLIA_INDEX}_tmp`);

    // 2. Copy the settings, synonyms and rules (but not the records)
    client.copyIndex(index.indexName, tmpIndex.indexName, [
        'settings',
        'synonyms',
        'rules'
    ]);

    // 3. Fetch your data and push it to the temporary index
    const objects = require(require('path').join(berun.options.paths.appBuild, 'algolia.json'));

    console.log(`Deploying ${objects.length} records to Algolia`)
    const objectsTmp = [...objects];

    while (objectsTmp.length) await tmpIndex.addObjects(objectsTmp.splice(0, 1000));

    // 4. Move the temporary index to the target index
    const result = await client.moveIndex(tmpIndex.indexName, index.indexName)

    console.log("Deployed to Algolia", result)

}