const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname, '../src/assets/content/rg')
let postList = []

const getPosts = () => {
	fs.readdir(dirPath, (err, files) => {
		if (err) return console.log('Failed to list contents of directory: ' + err)
		files.forEach((file, index) => {
			let obj = {}
			let post
			fs.readFile(`${dirPath}/${file}`, 'utf8', (err, contents) => {
				getMetadataIndices = (accumulator, elem, index) => {
					if (/^---/.test(elem)) {
						accumulator.push(index)
					}
					//console.log(accumulator)
					return accumulator
				}
				const parseMetadata = ({ lines, metadataIndices }) => {
					if (metadataIndices.length > 0) {
						let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
						metadata.forEach((line) => {
							obj[line.split(': ')[0]] = line.split(': ')[1]
						})
						return obj
					}
				}
				const parseContent = ({ lines, metadataIndices }) => {
					if (metadataIndices.length > 0) {
						lines = lines.slice(metadataIndices[1] + 1, lines.length)
					}
					return lines.join('\n')
				}
				const lines = contents.split('\n')
				const metadataIndices = lines.reduce(getMetadataIndices, [])
				const metadata = parseMetadata({ lines, metadataIndices })
				const content = parseContent({ lines, metadataIndices })
				const date = new Date(metadata.date)
				const timestamp = date.getTime() / 1000
				post = {
					id: timestamp,
					title: metadata.title ? metadata.title : 'No title available',
					author: metadata.author ? metadata.author : 'No author available',
					date: metadata.date ? metadata.date : 'No date available',
					image: metadata.image ? metadata.image : 'No image available',
					content: content ? content : 'No content available'
				}
				postList.push(post)
				if (index === files.length - 1) {
					const sortedList = postList.sort((a, b) => {
						return a.id < b.id ? 1 : -1
					})
					let data = JSON.stringify(sortedList)
					fs.writeFileSync('src/assets/rgPosts.json', data)
				}
			})
		})
	})
	return
}

getPosts()
