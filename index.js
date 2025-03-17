import minimist from 'minimist'
import { createRestAPIClient } from 'masto';

const accessToken = process.env.TOKEN
if(!accessToken){
    throw new Error(`TOKEN environment variable missing`)
}


const argv = minimist(process.argv.slice(2));
console.log(argv);

const mastoAccount = argv['_'][0]

const pieces = mastoAccount.match(/^@(.*)@(.*)$/)

console.log('pieces', pieces)
const [_, accountName, accountHostname] = pieces

const masto = await createRestAPIClient({
    url: `https://${accountHostname}`,
    accessToken: process.env.TOKEN
});

const account = await masto.v1.accounts.lookup({ acct: accountName });
const accountId = account.id;

console.log('accountName', accountName, accountId)

const statusPaginator = masto.v1.accounts.$select(accountId).statuses.list({limit: 40, onlyMedia: true})

const page = await statusPaginator.values()

const simplifiedPage = page.map(({id, createdAt, content, mediaAttachments, language}) => ({id, createdAt, content, mediaAttachments, language}))

console.log('simplifiedPage', simplifiedPage, simplifiedPage.length)

console.log('medias', simplifiedPage.map(p => p.mediaAttachments))