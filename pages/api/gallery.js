import agility from "@agility/content-fetch"

  // set up content fetch
  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
  })

export default async (req, res) => {
 // get gallery id
 const id = req.query.id

 if (!id) {
   res
     .status(400)
     .json({
       error: "No gallery id sent - add a query param for the gallery id",
     })
 }

 try {
    const gallery = await api.getGallery({
     galleryID: id,
   })

   const galleryData = gallery.media.map((img) => {
     return {
       mediaID: img.mediaID,
       fileName: img.fileName,
       url: img.url,
       metaData: img.metaData
     };
   });

   res.status(200).json({
     galleryData,
   })

 } catch (err) {
   console.log({ err })
   res.status(500).json({ err })
 }
};
