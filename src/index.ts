import {App} from './application';
(async function () {

    const app = new App();
    await app.listen().catch(console.log);

})();