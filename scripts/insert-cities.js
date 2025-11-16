require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const countriesData = [
  { name: 'Bénin', code: 'BJ', cities: ['Cotonou', 'Porto-Novo', 'Parakou', 'Djougou', 'Bohicon', 'Abomey', 'Natitingou', 'Lokossa', 'Ouidah', 'Kandi', 'Savalou', 'Comé', 'Sakété', 'Allada', 'Pobé'] },
  { name: 'Burkina Faso', code: 'BF', cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora', 'Dédougou', 'Kaya', 'Tenkodogo', 'Fada N\'gourma', 'Dori', 'Gaoua', 'Koupéla', 'Ziniaré', 'Houndé', 'Manga'] },
  { name: 'Côte d\'Ivoire', code: 'CI', cities: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo', 'Man', 'Divo', 'Gagnoa', 'Abengourou', 'Grand-Bassam', 'Séguéla', 'Bondoukou', 'Agboville', 'Dabou', 'Yopougon', 'Cocody', 'Marcory', 'Treichville', 'Adjamé'] },
  { name: 'Guinée', code: 'GN', cities: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé', 'Boké', 'Mamou', 'Kissidougou', 'Faranah', 'Siguiri', 'Macenta', 'Guéckédou', 'Télimélé', 'Pita', 'Dabola'] },
  { name: 'Mali', code: 'ML', cities: ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao', 'Tombouctou', 'Kidal', 'Kita', 'Bougouni', 'Markala', 'Kolokani', 'Niono', 'Djenné'] },
  { name: 'Niger', code: 'NE', cities: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua', 'Dosso', 'Diffa', 'Tillabéri', 'Arlit', 'Birni-N\'Konni', 'Madaoua', 'Tessaoua', 'Gaya', 'Magaria', 'Ayorou'] },
  { name: 'Sénégal', code: 'SN', cities: ['Dakar', 'Thiès', 'Rufisque', 'Kaolack', 'Ziguinchor', 'Saint-Louis', 'Louga', 'Tambacounda', 'Richard Toll', 'Mbour', 'Diourbel', 'Fatick', 'Kolda', 'Matam', 'Touba'] },
  { name: 'Togo', code: 'TG', cities: ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Palimé', 'Bassar', 'Tsévié', 'Aného', 'Mango', 'Dapaong', 'Tchamba', 'Bafilo', 'Notsé', 'Kpalimé', 'Vogan'] },
  { name: 'Cameroun', code: 'CM', cities: ['Douala', 'Yaoundé', 'Garoua', 'Bafoussam', 'Bamenda', 'Maroua', 'Buea', 'Kribi', 'Limbé', 'Nkongsamba', 'Ebolowa', 'Kousseri', 'Foumban', 'Dschang', 'Bertoua'] },
  { name: 'Centrafrique (RCA)', code: 'CF', cities: ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bambari', 'Bouar', 'Bossangoa', 'Bria', 'Bangassou', 'Nola', 'Kaga-Bandoro', 'Mbaïki', 'Bozoum', 'Paoua', 'Sibut'] },
  { name: 'Tchad', code: 'TD', cities: ['N\'Djamena', 'Moundou', 'Sarh', 'Abéché', 'Kelo', 'Koumra', 'Pala', 'Am Timan', 'Bongor', 'Mongo', 'Doba', 'Ati', 'Laï', 'Oum Hadjer', 'Bitkine'] },
  { name: 'Congo-Brazzaville', code: 'CG', cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Owando', 'Loandjili', 'Madingou', 'Gamboma', 'Impfondo', 'Sibiti', 'Mossendjo', 'Makoua', 'Djambala', 'Ewo'] },
  { name: 'République Démocratique du Congo (RDC)', code: 'CD', cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani', 'Bukavu', 'Kananga', 'Goma', 'Matadi', 'Kolwezi', 'Likasi', 'Bunia', 'Mbandaka', 'Uvira', 'Kikwit', 'Butembo'] },
  { name: 'Gabon', code: 'GA', cities: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila', 'Tchibanga', 'Koulamoutou', 'Lambaréné', 'Bitam', 'Gamba', 'Makokou', 'Ntoum', 'Okondja', 'Mitzic'] },
]

async function insertCities() {
  console.log('🚀 Insertion des villes dans la base de données...\n')

  for (const countryData of countriesData) {
    // Trouver le pays
    const { data: country, error: countryError } = await supabase
      .from('countries')
      .select('id')
      .eq('name', countryData.name)
      .single()

    if (countryError || !country) {
      console.error(`❌ Erreur pour ${countryData.name}:`, countryError?.message)
      continue
    }

    console.log(`📌 ${countryData.name} (${countryData.cities.length} villes)`)

    // Insérer les villes
    for (const cityName of countryData.cities) {
      const { error: cityError } = await supabase
        .from('cities')
        .insert([{ country_id: country.id, name: cityName }])
        .select()

      if (cityError && !cityError.message.includes('duplicate')) {
        console.error(`  ⚠️  Erreur pour ${cityName}:`, cityError.message)
      }
    }

    console.log(`  ✅ ${countryData.cities.length} villes insérées\n`)
  }

  console.log('✨ Insertion terminée !')
}

insertCities().catch(console.error)

