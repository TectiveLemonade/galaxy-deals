class DemoDataService {
  constructor() {
    this.melbourneCoordinates = {
      latitude: 28.2061,
      longitude: -80.685
    };
  }

  // Generate realistic restaurant data for Melbourne, FL area
  generateMelbourneRestaurants() {
    const restaurants = [
      // Fast Food Chains
      {
        name: "McDonald's",
        place_id: "demo_mcdonalds_1",
        rating: 3.8,
        price_level: 1,
        vicinity: "1234 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2123,
            lng: -80.6821
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_1" }],
        source: "demo"
      },
      {
        name: "Wendy's",
        place_id: "demo_wendys_1",
        rating: 3.9,
        price_level: 1,
        vicinity: "2156 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2087,
            lng: -80.6912
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_2" }],
        source: "demo"
      },
      {
        name: "Burger King",
        place_id: "demo_burgerking_1",
        rating: 3.7,
        price_level: 1,
        vicinity: "3421 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2198,
            lng: -80.6701
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_3" }],
        source: "demo"
      },
      {
        name: "Taco Bell",
        place_id: "demo_tacobell_1",
        rating: 3.6,
        price_level: 1,
        vicinity: "1876 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1845,
            lng: -80.6943
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_4" }],
        source: "demo"
      },
      {
        name: "KFC",
        place_id: "demo_kfc_1",
        rating: 3.5,
        price_level: 1,
        vicinity: "2134 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2156,
            lng: -80.6523
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_5" }],
        source: "demo"
      },
      {
        name: "Subway",
        place_id: "demo_subway_1",
        rating: 4.0,
        price_level: 1,
        vicinity: "3445 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2091,
            lng: -80.6987
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_6" }],
        source: "demo"
      },
      {
        name: "Chick-fil-A",
        place_id: "demo_chickfila_1",
        rating: 4.4,
        price_level: 2,
        vicinity: "1567 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2089,
            lng: -80.6834
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_7" }],
        source: "demo"
      },
      {
        name: "Pizza Hut",
        place_id: "demo_pizzahut_1",
        rating: 3.8,
        price_level: 2,
        vicinity: "2789 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2067,
            lng: -80.6723
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_8" }],
        source: "demo"
      },
      {
        name: "Domino's Pizza",
        place_id: "demo_dominos_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "1234 Sarno Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1987,
            lng: -80.6812
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_9" }],
        source: "demo"
      },
      {
        name: "Papa John's Pizza",
        place_id: "demo_papajohns_1",
        rating: 3.7,
        price_level: 2,
        vicinity: "3456 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1834,
            lng: -80.6934
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_10" }],
        source: "demo"
      },
      {
        name: "Starbucks",
        place_id: "demo_starbucks_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "1867 W New Haven Ave, Melbourne, FL",
        types: ["cafe", "restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2092,
            lng: -80.6856
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_11" }],
        source: "demo"
      },
      {
        name: "Dunkin'",
        place_id: "demo_dunkin_1",
        rating: 4.0,
        price_level: 1,
        vicinity: "2345 N Wickham Rd, Melbourne, FL",
        types: ["cafe", "restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2176,
            lng: -80.6534
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_12" }],
        source: "demo"
      },
      {
        name: "Panera Bread",
        place_id: "demo_panera_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "4567 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2095,
            lng: -80.7021
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_13" }],
        source: "demo"
      },
      {
        name: "Chipotle Mexican Grill",
        place_id: "demo_chipotle_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "1678 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1847,
            lng: -80.6891
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_14" }],
        source: "demo"
      },
      {
        name: "Five Guys",
        place_id: "demo_fiveguys_1",
        rating: 4.3,
        price_level: 2,
        vicinity: "2890 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2078,
            lng: -80.6734
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_15" }],
        source: "demo"
      },
      {
        name: "Jimmy John's",
        place_id: "demo_jimmyjohns_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "3789 Sarno Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1998,
            lng: -80.6823
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_16" }],
        source: "demo"
      },
      {
        name: "Popeyes Louisiana Kitchen",
        place_id: "demo_popeyes_1",
        rating: 3.8,
        price_level: 2,
        vicinity: "4123 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1856,
            lng: -80.6967
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_17" }],
        source: "demo"
      },
      {
        name: "Zaxby's",
        place_id: "demo_zaxbys_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "2456 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2134,
            lng: -80.6845
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_18" }],
        source: "demo"
      },
      {
        name: "Culver's",
        place_id: "demo_culvers_1",
        rating: 4.5,
        price_level: 2,
        vicinity: "1789 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2098,
            lng: -80.6545
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_19" }],
        source: "demo"
      },
      {
        name: "IHOP",
        place_id: "demo_ihop_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "3567 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2093,
            lng: -80.6978
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_20" }],
        source: "demo"
      },
      {
        name: "Denny's",
        place_id: "demo_dennys_1",
        rating: 3.7,
        price_level: 2,
        vicinity: "2678 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2056,
            lng: -80.6712
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_21" }],
        source: "demo"
      },
      // Local and Chain Restaurants
      {
        name: "Olive Garden Italian Restaurant",
        place_id: "demo_olivegarden_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "1456 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2088,
            lng: -80.6823
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_22" }],
        source: "demo"
      },
      {
        name: "Red Lobster",
        place_id: "demo_redlobster_1",
        rating: 4.0,
        price_level: 3,
        vicinity: "2789 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1843,
            lng: -80.6923
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_23" }],
        source: "demo"
      },
      {
        name: "Outback Steakhouse",
        place_id: "demo_outback_1",
        rating: 4.2,
        price_level: 3,
        vicinity: "3456 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2067,
            lng: -80.6745
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_24" }],
        source: "demo"
      },
      {
        name: "Texas Roadhouse",
        place_id: "demo_texasroadhouse_1",
        rating: 4.3,
        price_level: 2,
        vicinity: "4567 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2145,
            lng: -80.6867
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_25" }],
        source: "demo"
      },
      {
        name: "Applebee's Grill + Bar",
        place_id: "demo_applebees_1",
        rating: 3.8,
        price_level: 2,
        vicinity: "1678 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2087,
            lng: -80.6534
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_26" }],
        source: "demo"
      },
      {
        name: "TGI Fridays",
        place_id: "demo_tgifridays_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "2890 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2091,
            lng: -80.6945
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_27" }],
        source: "demo"
      },
      {
        name: "Chili's Grill & Bar",
        place_id: "demo_chilis_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "3789 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1849,
            lng: -80.6956
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_28" }],
        source: "demo"
      },
      {
        name: "Cracker Barrel Old Country Store",
        place_id: "demo_crackerbarrel_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "1234 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2045,
            lng: -80.6698
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_29" }],
        source: "demo"
      },
      {
        name: "LongHorn Steakhouse",
        place_id: "demo_longhorn_1",
        rating: 4.2,
        price_level: 3,
        vicinity: "2456 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2089,
            lng: -80.6889
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_30" }],
        source: "demo"
      },
      // Local Melbourne Restaurants
      {
        name: "The Melting Pot",
        place_id: "demo_meltingpot_1",
        rating: 4.4,
        price_level: 4,
        vicinity: "1567 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1845,
            lng: -80.6878
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_31" }],
        source: "demo"
      },
      {
        name: "Bonefish Grill",
        place_id: "demo_bonefish_1",
        rating: 4.3,
        price_level: 3,
        vicinity: "3678 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2078,
            lng: -80.6756
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_32" }],
        source: "demo"
      },
      {
        name: "First Watch",
        place_id: "demo_firstwatch_1",
        rating: 4.5,
        price_level: 2,
        vicinity: "2789 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2156,
            lng: -80.6856
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_33" }],
        source: "demo"
      },
      {
        name: "Carrabba's Italian Grill",
        place_id: "demo_carrabbas_1",
        rating: 4.2,
        price_level: 3,
        vicinity: "4789 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2094,
            lng: -80.7034
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_34" }],
        source: "demo"
      },
      {
        name: "Golden Corral Buffet & Grill",
        place_id: "demo_goldencorral_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "1890 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2123,
            lng: -80.6567
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_35" }],
        source: "demo"
      },
      {
        name: "Bahama Breeze",
        place_id: "demo_bahamabreeze_1",
        rating: 4.1,
        price_level: 3,
        vicinity: "3567 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2067,
            lng: -80.6734
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_36" }],
        source: "demo"
      },
      {
        name: "Hooters",
        place_id: "demo_hooters_1",
        rating: 3.8,
        price_level: 2,
        vicinity: "2678 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1847,
            lng: -80.6912
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_37" }],
        source: "demo"
      },
      {
        name: "Buffalo Wild Wings",
        place_id: "demo_buffalowildwings_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "4123 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2167,
            lng: -80.6878
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_38" }],
        source: "demo"
      },
      {
        name: "Cheddar's Scratch Kitchen",
        place_id: "demo_cheddars_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "1456 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2076,
            lng: -80.6523
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_39" }],
        source: "demo"
      },
      {
        name: "Ruby Tuesday",
        place_id: "demo_rubytuesday_1",
        rating: 3.7,
        price_level: 2,
        vicinity: "2789 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2091,
            lng: -80.6934
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_40" }],
        source: "demo"
      },
      // Asian Restaurants
      {
        name: "Panda Express",
        place_id: "demo_pandaexpress_1",
        rating: 3.9,
        price_level: 1,
        vicinity: "3789 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2078,
            lng: -80.6767
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_41" }],
        source: "demo"
      },
      {
        name: "P.F. Chang's",
        place_id: "demo_pfchangs_1", 
        rating: 4.1,
        price_level: 3,
        vicinity: "4567 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1851,
            lng: -80.6978
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_42" }],
        source: "demo"
      },
      {
        name: "Sakura Japanese Steakhouse",
        place_id: "demo_sakura_1",
        rating: 4.3,
        price_level: 3,
        vicinity: "1678 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2134,
            lng: -80.6823
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_43" }],
        source: "demo"
      },
      {
        name: "Thai Delight",
        place_id: "demo_thaidelight_1",
        rating: 4.4,
        price_level: 2,
        vicinity: "2890 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2187,
            lng: -80.6578
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_44" }],
        source: "demo"
      },
      {
        name: "China Garden",
        place_id: "demo_chinagarden_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "3456 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2092,
            lng: -80.6967
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_45" }],
        source: "demo"
      },
      // Mexican Restaurants
      {
        name: "Qdoba Mexican Eats",
        place_id: "demo_qdoba_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "1789 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2054,
            lng: -80.6687
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_46" }],
        source: "demo"
      },
      {
        name: "Moe's Southwest Grill",
        place_id: "demo_moes_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "2456 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1845,
            lng: -80.6901
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_47" }],
        source: "demo"
      },
      {
        name: "El Paso Mexican Restaurant",
        place_id: "demo_elpaso_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "3678 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2145,
            lng: -80.6845
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_48" }],
        source: "demo"
      },
      {
        name: "La Fiesta Mexican Restaurant",
        place_id: "demo_lafiesta_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "4789 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2198,
            lng: -80.6589
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_49" }],
        source: "demo"
      },
      // Italian Restaurants
      {
        name: "Macaroni Grill",
        place_id: "demo_macaronigrill_1",
        rating: 4.0,
        price_level: 3,
        vicinity: "1567 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2089,
            lng: -80.6834
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_50" }],
        source: "demo"
      },
      {
        name: "Fazoli's",
        place_id: "demo_fazolis_1",
        rating: 3.8,
        price_level: 1,
        vicinity: "2678 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2056,
            lng: -80.6712
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_51" }],
        source: "demo"
      },
      {
        name: "Villa Italian Kitchen",
        place_id: "demo_villa_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "3789 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1849,
            lng: -80.6956
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_52" }],
        source: "demo"
      },
      // Seafood Restaurants
      {
        name: "Captain D's",
        place_id: "demo_captaind_1",
        rating: 3.7,
        price_level: 2,
        vicinity: "4123 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2167,
            lng: -80.6878
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_53" }],
        source: "demo"
      },
      {
        name: "Long John Silver's",
        place_id: "demo_longjohn_1",
        rating: 3.5,
        price_level: 1,
        vicinity: "1890 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2123,
            lng: -80.6567
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_54" }],
        source: "demo"
      },
      {
        name: "Joe's Crab Shack",
        place_id: "demo_joescrab_1",
        rating: 3.9,
        price_level: 3,
        vicinity: "2456 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2056,
            lng: -80.6712
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_55" }],
        source: "demo"
      },
      // Local Melbourne Favorites
      {
        name: "Djon's Steak & Lobster House",
        place_id: "demo_djons_1",
        rating: 4.5,
        price_level: 4,
        vicinity: "1208 E New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2087,
            lng: -80.6234
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_56" }],
        source: "demo"
      },
      {
        name: "Meg O'Malley's Restaurant",
        place_id: "demo_megomalley_1",
        rating: 4.3,
        price_level: 3,
        vicinity: "812 E New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2089,
            lng: -80.6178
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_57" }],
        source: "demo"
      },
      {
        name: "Yellow Dog Cafe",
        place_id: "demo_yellowdog_1",
        rating: 4.6,
        price_level: 3,
        vicinity: "905 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2023,
            lng: -80.6645
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_58" }],
        source: "demo"
      },
      {
        name: "Mangetsu Japanese Restaurant",
        place_id: "demo_mangetsu_1",
        rating: 4.4,
        price_level: 3,
        vicinity: "1212 E New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2087,
            lng: -80.6223
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_59" }],
        source: "demo"
      },
      {
        name: "Ocean 302 Bar & Grill",
        place_id: "demo_ocean302_1",
        rating: 4.2,
        price_level: 3,
        vicinity: "302 Ocean Ave, Melbourne Beach, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.0678,
            lng: -80.5589
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_60" }],
        source: "demo"
      },
      {
        name: "Milliken's Reef",
        place_id: "demo_millikens_1",
        rating: 4.1,
        price_level: 3,
        vicinity: "4700 N A1A, Melbourne Beach, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.0823,
            lng: -80.5634
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_61" }],
        source: "demo"
      },
      {
        name: "Coconuts on the Beach",
        place_id: "demo_coconuts_1",
        rating: 4.3,
        price_level: 3,
        vicinity: "2 Minutemen Causeway, Melbourne Beach, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.0634,
            lng: -80.5578
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_62" }],
        source: "demo"
      },
      {
        name: "Squid Lips Overwater Grill",
        place_id: "demo_squidlips_1",
        rating: 4.0,
        price_level: 3,
        vicinity: "1477 Pineapple Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.0923,
            lng: -80.6012
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_63" }],
        source: "demo"
      },
      {
        name: "Crush XI",
        place_id: "demo_crush11_1",
        rating: 4.4,
        price_level: 3,
        vicinity: "432 5th Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.0834,
            lng: -80.6089
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_64" }],
        source: "demo"
      },
      {
        name: "The Dove II",
        place_id: "demo_dove2_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "1641 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2034,
            lng: -80.6634
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_65" }],
        source: "demo"
      },
      // More Chain Restaurants
      {
        name: "Sonic Drive-In",
        place_id: "demo_sonic_1",
        rating: 3.6,
        price_level: 1,
        vicinity: "3456 Sarno Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1998,
            lng: -80.6823
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_66" }],
        source: "demo"
      },
      {
        name: "Arby's",
        place_id: "demo_arbys_1",
        rating: 3.7,
        price_level: 1,
        vicinity: "2345 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1847,
            lng: -80.6901
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_67" }],
        source: "demo"
      },
      {
        name: "Checkers",
        place_id: "demo_checkers_1",
        rating: 3.5,
        price_level: 1,
        vicinity: "1234 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2123,
            lng: -80.6821
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_68" }],
        source: "demo"
      },
      {
        name: "White Castle",
        place_id: "demo_whitecastle_1",
        rating: 3.4,
        price_level: 1,
        vicinity: "4567 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2187,
            lng: -80.6578
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_69" }],
        source: "demo"
      },
      {
        name: "Hardee's",
        place_id: "demo_hardees_1",
        rating: 3.6,
        price_level: 1,
        vicinity: "2789 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2067,
            lng: -80.6723
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_70" }],
        source: "demo"
      },
      // More Local Restaurants
      {
        name: "Coasters Pub & Biergarten",
        place_id: "demo_coasters_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "4350 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1856,
            lng: -80.6967
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_71" }],
        source: "demo"
      },
      {
        name: "Fishlips Waterfront Bar & Grill",
        place_id: "demo_fishlips_1",
        rating: 4.0,
        price_level: 3,
        vicinity: "610 Glen Cheek Dr, Cape Canaveral, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.3856,
            lng: -80.5967
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_72" }],
        source: "demo"
      },
      {
        name: "Lou's Blues Upstairs",
        place_id: "demo_lousblues_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "2900 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2078,
            lng: -80.6734
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_73" }],
        source: "demo"
      },
      {
        name: "Hemingway's Tavern",
        place_id: "demo_hemingways_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "1535 Pineapple Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.0934,
            lng: -80.6023
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_74" }],
        source: "demo"
      },
      {
        name: "Charlie & Jake's BBQ",
        place_id: "demo_charliejake_1",
        rating: 4.3,
        price_level: 2,
        vicinity: "3500 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2198,
            lng: -80.6589
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_75" }],
        source: "demo"
      },
      // Additional Restaurants to reach 100+
      {
        name: "Boston Market",
        place_id: "demo_bostonmarket_1",
        rating: 3.8,
        price_level: 2,
        vicinity: "1456 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1845,
            lng: -80.6878
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_76" }],
        source: "demo"
      },
      {
        name: "El Pollo Loco",
        place_id: "demo_elpolloloco_1",
        rating: 3.9,
        price_level: 1,
        vicinity: "2567 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2134,
            lng: -80.6845
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_77" }],
        source: "demo"
      },
      {
        name: "Church's Chicken",
        place_id: "demo_churchs_1",
        rating: 3.5,
        price_level: 1,
        vicinity: "3678 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2078,
            lng: -80.6756
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_78" }],
        source: "demo"
      },
      {
        name: "Waffle House",
        place_id: "demo_wafflehouse_1",
        rating: 3.9,
        price_level: 1,
        vicinity: "1789 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2089,
            lng: -80.6856
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_79" }],
        source: "demo"
      },
      {
        name: "Perkins Restaurant & Bakery",
        place_id: "demo_perkins_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "2890 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2078,
            lng: -80.6734
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_80" }],
        source: "demo"
      },
      {
        name: "Village Inn",
        place_id: "demo_villageinn_1",
        rating: 3.8,
        price_level: 2,
        vicinity: "4123 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1856,
            lng: -80.6967
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_81" }],
        source: "demo"
      },
      {
        name: "Ryan's Grill Buffet & Bakery",
        place_id: "demo_ryans_1",
        rating: 3.7,
        price_level: 2,
        vicinity: "1567 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2134,
            lng: -80.6823
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_82" }],
        source: "demo"
      },
      {
        name: "Shoney's",
        place_id: "demo_shoneys_1",
        rating: 3.6,
        price_level: 2,
        vicinity: "2678 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2187,
            lng: -80.6578
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_83" }],
        source: "demo"
      },
      {
        name: "Friendly's",
        place_id: "demo_friendlys_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "3789 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2094,
            lng: -80.7034
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_84" }],
        source: "demo"
      },
      {
        name: "Bob Evans",
        place_id: "demo_bobevans_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "4567 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2078,
            lng: -80.6756
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_85" }],
        source: "demo"
      },
      // More Local Melbourne Spots
      {
        name: "Café Coconut Cove",
        place_id: "demo_coconutcove_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "1890 Melbourne Beach Blvd, Melbourne Beach, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.0712,
            lng: -80.5634
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_86" }],
        source: "demo"
      },
      {
        name: "Grills Riverside Seafood",
        place_id: "demo_grills_1",
        rating: 4.3,
        price_level: 3,
        vicinity: "6075 N US Highway 1, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2456,
            lng: -80.6123
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_87" }],
        source: "demo"
      },
      {
        name: "Bizzarro Famous NY Pizza",
        place_id: "demo_bizzarro_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "1209 E New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2087,
            lng: -80.6234
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_88" }],
        source: "demo"
      },
      {
        name: "Rusty's Seafood & Oyster Bar",
        place_id: "demo_rustys_1",
        rating: 4.0,
        price_level: 3,
        vicinity: "628 Glen Cheek Dr, Cape Canaveral, FL",
        types: ["restaurant", "food", "establishment"], 
        geometry: {
          location: {
            lat: 28.3867,
            lng: -80.5978
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_89" }],
        source: "demo"
      },
      {
        name: "Sandbar Sports Grill",
        place_id: "demo_sandbar_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "301 N Orlando Ave, Cocoa Beach, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.3234,
            lng: -80.6089
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_90" }],
        source: "demo"
      },
      // Final restaurants to exceed 100
      {
        name: "Hibachi Grill & Supreme Buffet",
        place_id: "demo_hibachi_1",
        rating: 3.8,
        price_level: 2,
        vicinity: "1456 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2045,
            lng: -80.6698
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_91" }],
        source: "demo"
      },
      {
        name: "Cracker Barrel Old Country Store",
        place_id: "demo_crackerbarrel2_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "2567 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2091,
            lng: -80.6912
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_92" }],
        source: "demo"
      },
      {
        name: "La Quinta Mexican Restaurant",
        place_id: "demo_laquinta_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "3678 Sarno Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1998,
            lng: -80.6823
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_93" }],
        source: "demo"
      },
      {
        name: "Smokey Bones Bar & Fire Grill",
        place_id: "demo_smokeybones_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "4789 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1856,
            lng: -80.6978
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_94" }],
        source: "demo"
      },
      {
        name: "Ryan's Family Steakhouse",
        place_id: "demo_ryanssteakhouse_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "1890 Babcock St, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2145,
            lng: -80.6867
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_95" }],
        source: "demo"
      },
      {
        name: "CiCi's Pizza",
        place_id: "demo_cicis_1",
        rating: 3.6,
        price_level: 1,
        vicinity: "2345 Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2056,
            lng: -80.6712
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_96" }],
        source: "demo"
      },
      {
        name: "Ming Court Chinese Restaurant",
        place_id: "demo_mingcourt_1",
        rating: 4.0,
        price_level: 2,
        vicinity: "3456 N Wickham Rd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2198,
            lng: -80.6589
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_97" }],
        source: "demo"
      },
      {
        name: "Beef 'O' Brady's",
        place_id: "demo_beefobradys_1",
        rating: 3.9,
        price_level: 2,
        vicinity: "4567 W New Haven Ave, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2095,
            lng: -80.7021
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_98" }],
        source: "demo"
      },
      {
        name: "Tijuana Flats",
        place_id: "demo_tijuanaflats_1",
        rating: 4.1,
        price_level: 2,
        vicinity: "1678 W Eau Gallie Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.1847,
            lng: -80.6891
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_99" }],
        source: "demo"
      },
      {
        name: "Miller's Ale House",
        place_id: "demo_millersalehouse_1",
        rating: 4.2,
        price_level: 2,
        vicinity: "2789 N Harbor City Blvd, Melbourne, FL",
        types: ["restaurant", "food", "establishment"],
        geometry: {
          location: {
            lat: 28.2067,
            lng: -80.6723
          }
        },
        opening_hours: { open_now: true },
        photos: [{ reference: "demo_photo_100" }],
        source: "demo"
      }
    ];

    return restaurants;
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100; // Round to 2 decimal places
  }

  // Filter restaurants by location and radius
  getRestaurantsNearLocation(latitude, longitude, radiusMiles = 25, limit = 100) {
    const allRestaurants = this.generateMelbourneRestaurants();
    
    // Calculate distances and filter by radius
    const restaurantsWithDistance = allRestaurants
      .map(restaurant => ({
        ...restaurant,
        distance: this.calculateDistance(
          latitude, 
          longitude,
          restaurant.geometry.location.lat,
          restaurant.geometry.location.lng
        )
      }))
      .filter(restaurant => restaurant.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return restaurantsWithDistance;
  }

  // Search restaurants for Melbourne, FL specifically
  searchMelbourneRestaurants(options = {}) {
    const {
      radius = 25,
      limit = 100,
      includeFastFood = true
    } = options;

    let restaurants = this.getRestaurantsNearLocation(
      this.melbourneCoordinates.latitude,
      this.melbourneCoordinates.longitude,
      radius,
      limit
    );

    // Filter out fast food if not wanted
    if (!includeFastFood) {
      const fastFoodChains = [
        "McDonald's", "Wendy's", "Burger King", "Taco Bell", "KFC", "Subway",
        "Chick-fil-A", "Pizza Hut", "Domino's Pizza", "Papa John's Pizza",
        "Dunkin'", "Starbucks", "Chipotle Mexican Grill", "Five Guys",
        "Jimmy John's", "Popeyes Louisiana Kitchen", "Zaxby's", "Culver's",
        "Panda Express", "Qdoba Mexican Eats", "Moe's Southwest Grill",
        "Sonic Drive-In", "Arby's", "Checkers", "White Castle", "Hardee's"
      ];
      
      restaurants = restaurants.filter(restaurant => 
        !fastFoodChains.includes(restaurant.name)
      );
    }

    return {
      success: true,
      restaurants: restaurants,
      total: restaurants.length,
      source: 'demo',
      searchLocation: {
        latitude: this.melbourneCoordinates.latitude,
        longitude: this.melbourneCoordinates.longitude,
        address: 'Melbourne, FL 32940, USA',
        radius: radius
      }
    };
  }

  // Check if demo data should be used based on location
  shouldUseDemoData(latitude, longitude, zipcode) {
    // Use demo data for Melbourne, FL area (zipcode 32940 and surrounding)
    const melbourneZipcodes = ['32940', '32901', '32902', '32903', '32904', '32905', '32934', '32935', '32936'];
    
    if (zipcode && melbourneZipcodes.includes(zipcode.toString())) {
      return true;
    }

    // Check if coordinates are near Melbourne, FL
    if (latitude && longitude) {
      const distance = this.calculateDistance(
        latitude, 
        longitude,
        this.melbourneCoordinates.latitude,
        this.melbourneCoordinates.longitude
      );
      return distance <= 50; // Within 50 miles of Melbourne, FL
    }

    return false;
  }

  // Convert demo data to standard format
  convertToStandardFormat(restaurant, ownerUserId) {
    return {
      name: restaurant.name,
      description: `Popular ${restaurant.name} location in Melbourne, FL area`,
      cuisineType: this.getCuisineTypeFromName(restaurant.name),
      contact: {
        email: `info@${restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: "(321) 555-" + Math.floor(Math.random() * 9000 + 1000),
        website: `https://${restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      },
      location: {
        type: "Point",
        coordinates: [restaurant.geometry.location.lng, restaurant.geometry.location.lat],
        address: {
          street: restaurant.vicinity.split(',')[0],
          city: "Melbourne",
          state: "FL",
          zipCode: "32940",
          country: "USA"
        }
      },
      hours: this.generateHours(),
      rating: { 
        average: restaurant.rating || 4.0, 
        count: Math.floor(Math.random() * 200 + 50) 
      },
      features: ["dine-in", "takeout"],
      priceRange: this.getPriceRange(restaurant.price_level),
      verified: true,
      owner: ownerUserId,
      googlePlaceId: restaurant.place_id,
      source: 'demo'
    };
  }

  getCuisineTypeFromName(name) {
    const cuisineMap = {
      "McDonald's": ["American", "Fast Food"],
      "Wendy's": ["American", "Fast Food"],
      "Burger King": ["American", "Fast Food"],
      "Taco Bell": ["Mexican", "Fast Food"],
      "KFC": ["American", "Fast Food"],
      "Subway": ["American", "Sandwiches"],
      "Chick-fil-A": ["American", "Fast Food"],
      "Pizza Hut": ["Italian", "Pizza"],
      "Domino's Pizza": ["Italian", "Pizza"],
      "Papa John's Pizza": ["Italian", "Pizza"],
      "Starbucks": ["American", "Coffee"],
      "Dunkin'": ["American", "Coffee"],
      "Panera Bread": ["American", "Bakery"],
      "Chipotle Mexican Grill": ["Mexican", "Fast Casual"],
      "Five Guys": ["American", "Burgers"],
      "Olive Garden Italian Restaurant": ["Italian"],
      "Red Lobster": ["Seafood", "American"],
      "Outback Steakhouse": ["American", "Steakhouse"],
      "Texas Roadhouse": ["American", "Steakhouse"],
      "Panda Express": ["Chinese", "Fast Food"],
      "P.F. Chang's": ["Chinese", "Asian"],
      "Sakura Japanese Steakhouse": ["Japanese", "Steakhouse"],
      "Thai Delight": ["Thai", "Asian"],
      "China Garden": ["Chinese", "Asian"]
    };

    return cuisineMap[name] || ["American"];
  }

  getPriceRange(priceLevel) {
    const priceMap = {
      1: "$",
      2: "$$", 
      3: "$$$",
      4: "$$$$"
    };
    return priceMap[priceLevel] || "$$";
  }

  generateHours() {
    return {
      monday: { open: "10:00", close: "22:00" },
      tuesday: { open: "10:00", close: "22:00" },
      wednesday: { open: "10:00", close: "22:00" },
      thursday: { open: "10:00", close: "22:00" },
      friday: { open: "10:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "11:00", close: "21:00" }
    };
  }
}

module.exports = DemoDataService;