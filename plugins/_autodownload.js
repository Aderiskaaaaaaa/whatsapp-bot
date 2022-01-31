const { igdl, tiktok, twitter, pin } = require('../lib/scrape')
const { servers, yta, ytv } = require('../lib/y2mate')
const fetch = require('node-fetch')
let yts = require('yt-search')
let util = require('util')
let handler = m => m

handler.all = async function (m, { isPrems }) {

    if (m.chat.endsWith('broadcast')) return
    if (db.data.users[m.sender].banned) return
    if (db.data.chats[m.chat].isBanned) return

    let url = m.text.split(/\n| /i)[0]

    if (/^.*vt.tiktok/i.test(m.text)) {
        let res = await fetch(API('rey', '/api/download/tiktok', { url }, 'apikey'))
        if (!res.ok) return m.reply(eror)
        let json = await res.json()
        await m.reply(wait)
        // m.reply(util.format(json))
        await this.sendFile(m.chat, json.result.nowatermark, '', 'With Watermark', m)
        await this.sendFile(m.chat, json.result.nowatermark, '', 'No Watermark', m)
        //await this.sendFile(m.chat, json.result.audio, 'eror.mp3', '', m, 1, { mimetype: 'audio/mp4' })
    }

    if (/^.*cocofun/i.test(m.text)) {
        let res = await fetch(API('jojo', '/api/cocofun-no-wm', { url }))
        if (!res.ok) return m.reply(eror)
        let json = await res.json()
        await m.reply(wait)
        // m.reply(util.format(json))
        await this.sendFile(m.chat, json.download, '', 'sukes ✓', m)
    }

    if (/^.*(fb.watch|facebook.com)/i.test(m.text)) {
        let res = await fetch(API('rey', 'api/downloader/facebook', { url }, 'apikey'))
        if (!res.ok) return m.reply(eror)
        let json = await res.json()
        await m.reply(wait)
        // m.reply(util.format(json))
        await conn.sendFile(m.chat, json.result.url, '', 'sukes ✓', m)
    }

    if (/^.*instagram.com\/(p|reel|tv)/i.test(m.text)) {
        let res = await fetch(API('fxc7', '/api/download/ig', { url }, 'apikey'))
        if (!res.ok) return m.reply(eror)
        let json = await res.json()
        await m.reply(wait)
        // m.reply(util.format(json))
        await this.sendFile(m.chat, json.result.url, '', 'sukes ✓', m)
    }

    if (/^.*(pinterest.com\/pin|pin.it)/i.test(m.text)) {
        pin(url).then(async res => {
            let pin = JSON.stringify(res)
            let json = JSON.parse(pin)
            if (!json.status) return m.reply(eror)
            await m.reply(wait)
            m.reply(util.format(json))
            await this.sendFile(m.chat, json.data.url, '', 'sukes ✓', m)
        }).catch(_ => _)
    }

    if (/^.*twitter.com\//i.test(m.text)) {
        twitter(url).then(async res => {
            let twit = JSON.stringify(res)
            let json = JSON.parse(twit)
            let pesan = json.data.map((v) => `Link: ${v.url}`).join('\n------------\n')
            await m.reply(wait)
            for (let { url } of json.data) {
                this.sendFile(m.chat, url, 'ig' + (/mp4/i.test(url) ? '.mp4' : '.jpg'), 'sukes ✓', m)
            }
        }).catch(_ => _)
    }

    if (/^https?:\/\/.*youtu/i.test(m.text)) {
        let results = await yts(url)
        let vid = results.all.find(video => video.seconds < 3600)
        if (!vid) return m.reply('Video/Audio Tidak ditemukan')
        let yt = false
        let usedServer = servers[0]
        for (let i in servers) {
            let server = servers[i]
            try {
                yt = await yta(vid.url, server)
                yt2 = await ytv(vid.url, server)
                usedServer = server
                break
            } catch (e) {
                m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nmencoba server lain...'}`)
            }
        }
        if (yt === false) return m.reply(eror)
        if (yt2 === false) return m.reply(eror)
        let { dl_link, thumb, title, filesize, filesizeF } = yt
        await this.send2ButtonLoc(m.chat, await (await fetch(thumb)).buffer(), `
*Judul:* ${title}
*Ukuran File Audio:* ${filesizeF}
*Ukuran File Video:* ${yt2.filesizeF}
*Server y2mate:* ${usedServer}
`.trim(), '❤️ Erzaa', 'Audio', `.yta ${vid.url}`, 'Video', `.yt ${vid.url}`)
    }

}

handler.limit = true
module.exports = handler
