import {join, extname} from 'node:path';
import {mkdir} from 'node:fs/promises'
import {createWriteStream} from 'node:fs'

import https from 'node:https'


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
//console.log('pieces', pieces)

const [_, accountName, accountHostname] = pieces

const masto = await createRestAPIClient({
    url: `https://${accountHostname}`,
    accessToken: process.env.TOKEN
});

const account = await masto.v1.accounts.lookup({ acct: accountName });
const accountId = account.id;

console.log('accountName', accountName, accountId)

const IMAGES_SUBDIR_NAME = 'images'

const backupDirName = `backup-${mastoAccount}`
const backupDirPath = join(process.cwd(), backupDirName)
const backupImagesDirPath = join(backupDirPath, IMAGES_SUBDIR_NAME)

try{
    await mkdir(backupDirPath)
    await mkdir(backupImagesDirPath)
}
catch(e){
    if(e.code === 'EEXIST'){
        //ignore
    }
    else{
        throw e
    }
}

function downloadImage(url, filepath){
    console.log('download', url, 'to', filepath)

    return new Promise((resolve, reject) => {
        const fileWriteStream = createWriteStream(filepath)
        const resp = https.get(url, res => {
            res.pipe(fileWriteStream)
        
            res.on('error', reject)

        })
        
        fileWriteStream.on('error', reject)
        fileWriteStream.on('finish', resolve)
    })
}


const statusPaginator = masto.v1.accounts.$select(accountId).statuses.list({limit: 40, onlyMedia: true})

let imagePathToAltText = new Map()

for await (const page of statusPaginator){
    //console.log('page', page.length, page[0].id)

    for(const status of page){
        //const {id, createdAt, content, mediaAttachments, language} = page
        const {mediaAttachments} = status

        for(const mediaAttachement of mediaAttachments){
            const {id, url, type, description} = mediaAttachement

            if(type === 'image' && url){
                const extension = extname(url)
                const filename = `${id}${extension}`
                //console.log('filename', filename, url)
                imagePathToAltText.set(`${IMAGES_SUBDIR_NAME}/${filename}`, description)

                const pathname = join(backupImagesDirPath, filename)
                await downloadImage(url, pathname)
            }
            else{
                // ignore
            }
        }
    }

    
}
