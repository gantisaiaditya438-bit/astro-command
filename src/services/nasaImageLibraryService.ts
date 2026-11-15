import { NasaImageRecord, NasaImageSearchResponse } from '../types/nasaImages';

// Curated authentic NASA Planetary Collections from official NASA Image & Video Library
export const CURATED_NASA_PLANET_COLLECTIONS: Record<string, NasaImageRecord[]> = {
  Moon: [
    {
      nasa_id: 'as11-40-5903',
      planet: 'Moon',
      title: 'Buzz Aldrin on the Moon - Apollo 11',
      description: 'Astronaut Buzz Aldrin, lunar module pilot of Apollo 11, poses for a photograph beside the deployed passive seismic experiment on the surface of the Moon at Mare Tranquillitatis. Photographed by Neil Armstrong with a 70mm Hasselblad camera.',
      image_url: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-as11-40-5903',
      credit: 'NASA / Neil Armstrong',
      date_created: '1969-07-20T20:17:00Z',
      media_type: 'image',
      center: 'JSC',
      keywords: ['Apollo 11', 'Moon', 'Buzz Aldrin', 'Mare Tranquillitatis', 'Lunar Surface']
    },
    {
      nasa_id: 'PIA13517',
      planet: 'Moon',
      title: 'Shackleton Crater Rim at the Lunar South Pole',
      description: 'Lunar Reconnaissance Orbiter Camera (LROC) Narrow Angle Camera (NAC) mosaic of Shackleton Crater rim. Sunlight strikes the rim peak continuously while the interior crater floor remains in permanent cryogenic darkness, preserving ancient cometary water-ice.',
      image_url: 'https://images-assets.nasa.gov/image/PIA13517/PIA13517~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA13517/PIA13517~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA13517',
      credit: 'NASA/GSFC/Arizona State University',
      date_created: '2010-09-17T12:00:00Z',
      media_type: 'image',
      center: 'GSFC',
      keywords: ['LROC', 'LRO', 'Shackleton Crater', 'Lunar South Pole', 'Water Ice']
    },
    {
      nasa_id: 'PIA12235',
      planet: 'Moon',
      title: 'Dramatic Central Peak of Tycho Crater',
      description: 'Spectacular oblique sunrise view of the central peak complex of Tycho Crater on the Moon, taken by NASA’s Lunar Reconnaissance Orbiter (LRO). The central peak rises 2 kilometers (6,500 feet) above the crater floor.',
      image_url: 'https://images-assets.nasa.gov/image/PIA12235/PIA12235~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA12235/PIA12235~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA12235',
      credit: 'NASA/Goddard/Arizona State University',
      date_created: '2009-08-14T00:00:00Z',
      media_type: 'image',
      center: 'GSFC',
      keywords: ['LRO', 'Tycho Crater', 'Central Peak', 'Moon Geology']
    },
    {
      nasa_id: 'as11-40-5878',
      planet: 'Moon',
      title: 'Astronaut Bootprint in Lunar Regolith - Apollo 11',
      description: 'Close-up view of an astronaut bootprint in the fine-grained lunar soil, photographed during the Apollo 11 lunar surface extravehicular activity. Because the Moon has no atmosphere or rain, this bootprint will endure for millions of years.',
      image_url: 'https://images-assets.nasa.gov/image/as11-40-5878/as11-40-5878~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/as11-40-5878/as11-40-5878~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-as11-40-5878',
      credit: 'NASA / Buzz Aldrin',
      date_created: '1969-07-20T21:00:00Z',
      media_type: 'image',
      center: 'JSC',
      keywords: ['Apollo 11', 'Bootprint', 'Regolith', 'Lunar Soil']
    }
  ],
  Mars: [
    {
      nasa_id: 'PIA24424',
      planet: 'Mars',
      title: 'Perseverance Rover Mastcam-Z Panorama of Jezero Delta',
      description: 'High-definition 360-degree panorama of Jezero Crater captured by the Mastcam-Z dual-camera system aboard NASA’s Perseverance Mars rover. Layered sedimentary mudstones show where an ancient river once flowed into a prehistoric lake billions of years ago.',
      image_url: 'https://images-assets.nasa.gov/image/PIA24424/PIA24424~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA24424/PIA24424~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA24424',
      credit: 'NASA/JPL-Caltech/ASU/MSSS',
      date_created: '2021-03-05T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Perseverance', 'Mars 2020', 'Jezero Crater', 'Mastcam-Z', 'Delta']
    },
    {
      nasa_id: 'PIA24658',
      planet: 'Mars',
      title: 'Curiosity Rover at Mount Sharp’s Sulfate Layers',
      description: 'Curiosity rover captured this panorama of Mont Mercou and the sulfate-bearing layered sedimentary rocks of Mount Sharp (Aeolis Mons) in Gale Crater, documenting Mars drying out billions of years ago.',
      image_url: 'https://images-assets.nasa.gov/image/PIA24658/PIA24658~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA24658/PIA24658~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA24658',
      credit: 'NASA/JPL-Caltech/MSSS',
      date_created: '2021-06-12T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Curiosity', 'Mount Sharp', 'Gale Crater', 'Mars Geology']
    },
    {
      nasa_id: 'PIA07997',
      planet: 'Mars',
      title: 'Blue Martian Sunset Over Gusev Crater',
      description: 'Spirit rover photographed the Sun sinking below the rim of Gusev Crater on Mars. Fine airborne dust particles scatter red light while allowing blue light to penetrate, making Martian sunsets glow a twilight blue!',
      image_url: 'https://images-assets.nasa.gov/image/PIA07997/PIA07997~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA07997/PIA07997~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA07997',
      credit: 'NASA/JPL/Texas A&M/Cornell',
      date_created: '2005-05-19T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Mars Sunset', 'Spirit Rover', 'Gusev Crater', 'Atmosphere']
    }
  ],
  Mercury: [
    {
      nasa_id: 'PIA15614',
      planet: 'Mercury',
      title: 'MESSENGER Enhanced Color Global Mosaic of Mercury',
      description: 'Full global view of Mercury captured by NASA’s MESSENGER spacecraft (Mercury Surface, Space Environment, Geochemistry, and Ranging). Color differences highlight variations in surface mineralogy, volcanic plains, and impact craters.',
      image_url: 'https://images-assets.nasa.gov/image/PIA15614/PIA15614~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA15614/PIA15614~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA15614',
      credit: 'NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington',
      date_created: '2013-02-15T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Mercury', 'MESSENGER', 'Planetary Geology', 'Caloris Basin']
    },
    {
      nasa_id: 'PIA11364',
      planet: 'Mercury',
      title: 'MESSENGER First Flyby View of Caloris Basin',
      description: 'MESSENGER captured this stunning perspective of the gigantic Caloris impact basin on Mercury, spanning over 1,550 km. Volcanic smooth plains fill the basin floor while tectonic grabens radiate outward.',
      image_url: 'https://images-assets.nasa.gov/image/PIA11364/PIA11364~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA11364/PIA11364~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA11364',
      credit: 'NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington',
      date_created: '2008-01-30T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Caloris Basin', 'MESSENGER', 'Mercury Craters', 'Impact Geology']
    },
    {
      nasa_id: 'PIA02986',
      planet: 'Mercury',
      title: 'Mariner 10 Inbound High-Resolution Mosaic of Mercury',
      description: 'Historic high-resolution mosaic of Mercury photographed by NASA’s Mariner 10 on March 29, 1974, during mankind’s first ever spacecraft encounter with the innermost planet. It revealed a Moon-like cratered world with massive thrust faults.',
      image_url: 'https://images-assets.nasa.gov/image/PIA02986/PIA02986~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA02986/PIA02986~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA02986',
      credit: 'NASA/JPL',
      date_created: '1974-03-29T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Mariner 10', 'Mercury Surface', 'Historical Mission', 'Impact Craters']
    }
  ],
  Venus: [
    {
      nasa_id: 'PIA00104',
      planet: 'Venus',
      title: 'Magellan Radar Hemispheric Map of Venus',
      description: 'Global hemispheric visualization of Venus generated using synthetic aperture radar (SAR) aboard NASA’s Magellan spacecraft. Because Venus is perpetually enveloped in thick sulfuric acid clouds, radar waves penetrated the veil to map volcanic lava flows and tectonic fractures.',
      image_url: 'https://images-assets.nasa.gov/image/PIA00104/PIA00104~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA00104/PIA00104~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA00104',
      credit: 'NASA/JPL',
      date_created: '1996-09-03T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      isRadarDerived: true,
      keywords: ['Venus', 'Magellan', 'Radar', 'Volcanoes', 'Synthetic Aperture Radar']
    },
    {
      nasa_id: 'PIA00271',
      planet: 'Venus',
      title: 'Magellan 3D Perspective Radar View of Maat Mons Volcano',
      description: 'Computer-generated perspective view of Maat Mons, the highest volcano on Venus (8 km high), constructed from Magellan synthetic aperture radar altimetry data. Recent lava flows extend for hundreds of kilometers across the plains.',
      image_url: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA00271',
      credit: 'NASA/JPL',
      date_created: '1991-03-13T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      isRadarDerived: true,
      keywords: ['Maat Mons', 'Magellan', 'Radar Altimetry', 'Venus Volcano']
    },
    {
      nasa_id: 'PIA00062',
      planet: 'Venus',
      title: 'Magellan Radar Mosaic of Lakshmi Planum',
      description: 'Synthetic aperture radar mosaic of the Lakshmi Planum plateau and Akna Montes mountain ranges on Venus. Radar backscatter brightness indicates roughness of fractures and fractured volcanic basalt plains.',
      image_url: 'https://images-assets.nasa.gov/image/PIA00062/PIA00062~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA00062/PIA00062~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA00062',
      credit: 'NASA/JPL',
      date_created: '1991-01-22T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      isRadarDerived: true,
      keywords: ['Lakshmi Planum', 'Magellan SAR', 'Radar Topography']
    }
  ],
  Earth: [
    {
      nasa_id: 'as17-148-22727',
      planet: 'Earth',
      title: 'The Blue Marble - Apollo 17',
      description: 'The iconic "Blue Marble" photograph of Earth, captured on December 7, 1972, by the crew of Apollo 17 as they traveled to the Moon. The photograph extends from the Mediterranean Sea to the Antarctica south polar ice cap.',
      image_url: 'https://images-assets.nasa.gov/image/as17-148-22727/as17-148-22727~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/as17-148-22727/as17-148-22727~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-as17-148-22727',
      credit: 'NASA / Apollo 17 Crew',
      date_created: '1972-12-07T00:00:00Z',
      media_type: 'image',
      center: 'JSC',
      keywords: ['Earth', 'Blue Marble', 'Apollo 17', 'Oceans', 'Atmosphere']
    },
    {
      nasa_id: 'as08-14-2383',
      planet: 'Earth',
      title: 'Earthrise from Lunar Orbit - Apollo 8',
      description: 'Astronaut William Anders took this historic photograph of Earth rising over the barren lunar horizon on December 24, 1968, during the Apollo 8 circumlunar mission. It showed humanity our fragile, solitary oasis in deep space.',
      image_url: 'https://images-assets.nasa.gov/image/as08-14-2383/as08-14-2383~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/as08-14-2383/as08-14-2383~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-as08-14-2383',
      credit: 'NASA / Bill Anders',
      date_created: '1968-12-24T00:00:00Z',
      media_type: 'image',
      center: 'JSC',
      keywords: ['Earthrise', 'Apollo 8', 'Moon Orbit', 'Space Heritage']
    },
    {
      nasa_id: 'GSFC_20171208_archive_e001887',
      planet: 'Earth',
      title: 'Earth Observation: City Lights & Aurora from Space Station',
      description: 'Expedition astronauts aboard the International Space Station photographed this breathtaking nocturnal vista of Earth, showing glowing atmospheric airglow, neon green aurora australis, and glittering city light clusters.',
      image_url: 'https://images-assets.nasa.gov/image/GSFC_20171208_archive_e001887/GSFC_20171208_archive_e001887~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/GSFC_20171208_archive_e001887/GSFC_20171208_archive_e001887~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-GSFC_20171208_archive_e001887',
      credit: 'NASA / ISS Crew / GSFC',
      date_created: '2011-09-17T00:00:00Z',
      media_type: 'image',
      center: 'GSFC',
      keywords: ['Earth Observation', 'ISS', 'Aurora', 'Atmosphere']
    }
  ],
  Jupiter: [
    {
      nasa_id: 'PIA22949',
      planet: 'Jupiter',
      title: 'JunoCam Close-Up of Jupiter’s Great Red Spot',
      description: 'NASA’s Juno spacecraft captured this stunning, close-up true-color view of Jupiter’s Great Red Spot, a gargantuan high-pressure storm wider than planet Earth with 400-mile-per-hour winds.',
      image_url: 'https://images-assets.nasa.gov/image/PIA22949/PIA22949~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA22949/PIA22949~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA22949',
      credit: 'NASA/JPL-Caltech/SwRI/MSSS/Kevin M. Gill',
      date_created: '2019-02-12T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Jupiter', 'Juno', 'JunoCam', 'Great Red Spot', 'Gas Giant']
    },
    {
      nasa_id: 'PIA21771',
      planet: 'Jupiter',
      title: 'Juno Over Jupiter’s South Polar Cyclones',
      description: 'Infrared and visible composite by NASA’s Juno spacecraft revealing a central cyclone encircled by five peripheral Earth-sized cyclones churning at Jupiter’s south pole.',
      image_url: 'https://images-assets.nasa.gov/image/PIA21771/PIA21771~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA21771/PIA21771~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA21771',
      credit: 'NASA/JPL-Caltech',
      date_created: '2017-05-25T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Juno', 'Jupiter Atmosphere', 'South Pole', 'Cyclones']
    },
    {
      nasa_id: 'PIA00502',
      planet: 'Jupiter',
      title: 'Galileo View of Europa Ocean Moon Fractured Ice Shell',
      description: 'NASA’s Galileo spacecraft captured this view of Europa’s cracked, crisscrossed icy surface. Beneath this kilometers-thick outer crust lies a global salt-water ocean containing more water than all of Earth’s oceans combined.',
      image_url: 'https://images-assets.nasa.gov/image/PIA00502/PIA00502~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA00502/PIA00502~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA00502',
      credit: 'NASA/JPL/DLR',
      date_created: '1997-01-18T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Europa', 'Galileo', 'Subsurface Ocean', 'Jupiter Moons']
    }
  ],
  Saturn: [
    {
      nasa_id: 'PIA17172',
      planet: 'Saturn',
      title: 'The Day the Earth Smiled - Cassini Mosaic of Saturn',
      description: 'Backlit panoramic mosaic of Saturn and its glittering rings captured by NASA’s Cassini spacecraft from inside the planet’s shadow. Tiny in the background, Earth is visible as a pale blue dot millions of miles away.',
      image_url: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA17172',
      credit: 'NASA/JPL-Caltech/SSI',
      date_created: '2013-11-12T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Saturn', 'Cassini', 'Saturn Rings', 'The Day the Earth Smiled']
    },
    {
      nasa_id: 'PIA14922',
      planet: 'Saturn',
      title: 'Cassini Natural-Color View of Saturn and Rings',
      description: 'Spectacular natural-color portrait of Saturn and its luminous ring system acquired by Cassini as the seasons shifted on the giant gas world.',
      image_url: 'https://images-assets.nasa.gov/image/PIA14922/PIA14922~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA14922/PIA14922~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA14922',
      credit: 'NASA/JPL-Caltech/SSI',
      date_created: '2012-12-18T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Saturn Rings', 'Cassini', 'Natural Color', 'Atmosphere']
    },
    {
      nasa_id: 'PIA19658',
      planet: 'Saturn',
      title: 'Enceladus Water-Ice Geysers Erupting Into Space',
      description: 'Cassini captured dramatic backlit plumes of water vapor and ice crystals shooting from deep hydrothermal vents at the south pole of Saturn’s moon Enceladus, confirming a warm subsurface global ocean.',
      image_url: 'https://images-assets.nasa.gov/image/PIA19658/PIA19658~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA19658/PIA19658~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA19658',
      credit: 'NASA/JPL-Caltech/SSI',
      date_created: '2015-10-28T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Enceladus', 'Cassini', 'Geysers', 'Hydrothermal Ocean']
    },
    {
      nasa_id: 'PIA06114',
      planet: 'Saturn',
      title: 'Titan Thick Nitrogen & Methane Atmosphere in Ultraviolet',
      description: 'Cassini ultraviolet image of Saturn’s colossal moon Titan, revealing its thick detached orange photochemical smog haze layers. Titan is the only moon with a dense atmosphere and liquid methane lakes.',
      image_url: 'https://images-assets.nasa.gov/image/PIA06114/PIA06114~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA06114/PIA06114~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA06114',
      credit: 'NASA/JPL/Space Science Institute',
      date_created: '2004-07-03T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Titan', 'Cassini', 'Atmospheric Haze', 'Methane']
    }
  ],
  Uranus: [
    {
      nasa_id: 'PIA01393',
      planet: 'Uranus',
      title: 'Voyager 2 View of Uranus in True Color',
      description: 'Full-disk view of Uranus captured by Voyager 2 on January 14, 1986. Atmospheric methane absorbs red sunlight, giving Uranus its serene cyan-aquamarine appearance.',
      image_url: 'https://images-assets.nasa.gov/image/PIA01393/PIA01393~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA01393/PIA01393~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA01393',
      credit: 'NASA/JPL',
      date_created: '1986-01-14T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Uranus', 'Voyager 2', 'Ice Giant', 'Methane']
    },
    {
      nasa_id: 'PIA00035',
      planet: 'Uranus',
      title: 'Voyager 2 High-Resolution View of Moon Miranda',
      description: 'Voyager 2 photographed the extraordinarily fractured, patchwork terrain of Uranus’s moon Miranda, featuring chevron-shaped fault ridges and the 20-kilometer-deep Verona Rupes cliff (the tallest known cliff in the solar system).',
      image_url: 'https://images-assets.nasa.gov/image/PIA00035/PIA00035~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA00035/PIA00035~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA00035',
      credit: 'NASA/JPL',
      date_created: '1986-01-24T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Miranda', 'Voyager 2', 'Verona Rupes', 'Uranus Moons']
    },
    {
      nasa_id: 'PIA01458',
      planet: 'Uranus',
      title: 'Uranus Dark Narrow Ring System in Forward-Scattered Light',
      description: 'Voyager 2 captured this backward-looking wide-angle view of Uranus’s delicate ring system, showing extremely dark, charcoal-like carbon dust rings and shepherding moon orbits.',
      image_url: 'https://images-assets.nasa.gov/image/PIA01458/PIA01458~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA01458/PIA01458~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA01458',
      credit: 'NASA/JPL',
      date_created: '1986-01-25T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Uranus Rings', 'Voyager 2', 'Ring System']
    }
  ],
  Neptune: [
    {
      nasa_id: 'PIA01492',
      planet: 'Neptune',
      title: 'Voyager 2 High-Resolution View of Neptune',
      description: 'Voyager 2 captured this portrait of Neptune during its August 1989 close encounter, showing the Great Dark Spot and bright, high-altitude white cirrus clouds of frozen methane.',
      image_url: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA01492',
      credit: 'NASA/JPL',
      date_created: '1989-08-20T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Neptune', 'Voyager 2', 'Great Dark Spot', 'Methane Clouds']
    },
    {
      nasa_id: 'PIA02213',
      planet: 'Neptune',
      title: 'Crescent Neptune and Moon Triton',
      description: 'Three days after closest flyby, Voyager 2 looked back toward the Sun to record this parting portrait of crescent Neptune and its retrograde captured Kuiper Belt moon Triton.',
      image_url: 'https://images-assets.nasa.gov/image/PIA02213/PIA02213~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA02213/PIA02213~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA02213',
      credit: 'NASA/JPL',
      date_created: '1989-08-31T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Neptune Crescent', 'Triton', 'Voyager 2', 'Flyby Departure']
    },
    {
      nasa_id: 'PIA00317',
      planet: 'Neptune',
      title: 'Triton Southern Hemisphere Cryogenic Nitrogen Ice & Geysers',
      description: 'Voyager 2 mosaic of the south polar terrain of moon Triton, showing cantaloupe terrain and dark streaks left by active cryogenic nitrogen geysers erupting 8 km high into near-vacuum space.',
      image_url: 'https://images-assets.nasa.gov/image/PIA00317/PIA00317~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/PIA00317/PIA00317~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-PIA00317',
      credit: 'NASA/JPL/USGS',
      date_created: '1989-08-25T00:00:00Z',
      media_type: 'image',
      center: 'JPL',
      keywords: ['Triton', 'Cryovolcanism', 'Nitrogen Geysers', 'Neptune Moons']
    }
  ],
  Sun: [
    {
      nasa_id: 'GSFC_20171208_archive_e001435',
      planet: 'Sun',
      title: 'Massive Coronal Mass Ejection - SDO',
      description: 'Magnificent coronal mass ejection (CME) erupts from the Sun at over 900 miles per second, photographed in extreme ultraviolet wavelength (304 Angstroms) by NASA’s Solar Dynamics Observatory (SDO).',
      image_url: 'https://images-assets.nasa.gov/image/GSFC_20171208_archive_e001435/GSFC_20171208_archive_e001435~medium.jpg',
      thumb_url: 'https://images-assets.nasa.gov/image/GSFC_20171208_archive_e001435/GSFC_20171208_archive_e001435~thumb.jpg',
      source_url: 'https://images.nasa.gov/details-GSFC_20171208_archive_e001435',
      credit: 'NASA/SDO',
      date_created: '2012-08-31T00:00:00Z',
      media_type: 'image',
      center: 'GSFC',
      keywords: ['Sun', 'SDO', 'Solar Flare', 'Coronal Mass Ejection']
    }
  ]
};

// In-memory search cache with 30-minute TTL
const searchCache = new Map<string, { timestamp: number; data: NasaImageSearchResponse }>();
const CACHE_TTL = 30 * 60 * 1000;

/**
 * Search the official NASA Image and Video Library API
 */
export async function searchNasaImageLibrary(
  query: string,
  planet?: string
): Promise<NasaImageSearchResponse> {
  const cacheKey = `${query.toLowerCase().trim()}_${planet || 'all'}`;
  const now = Date.now();

  const cached = searchCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, source: 'CACHED' };
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const isBrowser = typeof window !== 'undefined';
    // Use Vite proxy endpoint in browser to avoid CORS/network hiccups, or direct NASA API
    const url = isBrowser
      ? `/api/nasa-images?q=${encodedQuery}${planet ? `&planet=${encodeURIComponent(planet)}` : ''}`
      : `https://images-api.nasa.gov/search?q=${encodedQuery}&media_type=image`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      // If served via /api/nasa-images proxy, json.items is already structured
      if (Array.isArray(json.items) && json.items.length > 0) {
        const result: NasaImageSearchResponse = {
          items: json.items,
          totalHits: json.totalHits || json.items.length,
          source: json.source || 'LIVE_API',
          query,
          planet
        };
        searchCache.set(cacheKey, { timestamp: now, data: result });
        return result;
      }

      // If direct NASA API format
      const rawItems = json.collection?.items || [];

      const parsedItems: NasaImageRecord[] = rawItems
        .slice(0, 24)
        .map((item: any) => {
          const data = item.data?.[0] || {};
          const links = item.links || [];
          const thumbLink = links.find((l: any) => l.rel === 'preview')?.href || '';
          const mediumLink = thumbLink.replace('~thumb.jpg', '~medium.jpg');

          return {
            nasa_id: data.nasa_id || 'NASA-IMG',
            planet: planet || 'Space',
            title: data.title || 'NASA Space Observation',
            description: data.description || 'Genuine space observation recorded by NASA mission spacecraft.',
            image_url: mediumLink || thumbLink,
            thumb_url: thumbLink || mediumLink,
            source_url: `https://images.nasa.gov/details-${data.nasa_id}`,
            credit: data.secondary_creator || data.photographer || (data.center ? `NASA/${data.center}` : 'NASA'),
            date_created: data.date_created || new Date().toISOString(),
            media_type: data.media_type || 'image',
            center: data.center,
            keywords: data.keywords || []
          };
        })
        .filter((item: NasaImageRecord) => Boolean(item.thumb_url && item.nasa_id));

      if (parsedItems.length > 0) {
        const result: NasaImageSearchResponse = {
          items: parsedItems,
          totalHits: json.collection?.metadata?.total_hits || parsedItems.length,
          source: 'LIVE_API',
          query,
          planet
        };

        searchCache.set(cacheKey, { timestamp: now, data: result });
        return result;
      }
    }
  } catch (err) {
    console.warn('NASA Image Library live search failed, using curated archive', err);
  }

  // Fallback to curated collections
  let fallbackList: NasaImageRecord[] = [];
  if (planet && CURATED_NASA_PLANET_COLLECTIONS[planet]) {
    fallbackList = CURATED_NASA_PLANET_COLLECTIONS[planet];
  } else {
    // Combine all curated planetary items
    Object.values(CURATED_NASA_PLANET_COLLECTIONS).forEach(list => {
      fallbackList.push(...list);
    });
  }

  const filtered = fallbackList.filter(
    item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.planet.toLowerCase().includes(query.toLowerCase()) ||
      (item.keywords && item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())))
  );

  return {
    items: filtered.length > 0 ? filtered : fallbackList,
    totalHits: fallbackList.length,
    source: 'CURATED_ARCHIVE',
    query,
    planet
  };
}

/**
 * Get curated photograph collection for a specific planet
 */
export function getCuratedPlanetPhotos(planetName: string): NasaImageRecord[] {
  return CURATED_NASA_PLANET_COLLECTIONS[planetName] || [];
}
