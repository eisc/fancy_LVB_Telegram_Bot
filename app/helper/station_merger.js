exports.getCompositeStations = function () {
    const composites = [
        {
            name: 'Leipzig, Hauptbahnhof',
            mappedStations: [
                {
                    id: '1:8071472',
                    name: 'Leipzig Hbf Ostseite'
                },
                {
                    id: '1:0010811',
                    name: 'Leipzig, Hauptbahnhof/Ostseite'
                },
                {
                    id: '1:0011412',
                    name: 'Leipzig, Wintergartenstr./Hauptbahnhof'
                },
                {
                    id: '1:0015738',
                    name: 'Leipzig, Hauptbahnhof/Goethestr.'
                },
                {
                    id: '1:8010205',
                    name: 'Leipzig Hbf ZUG'
                },
                {
                    id: '1:8098205',
                    name: 'Leipzig Hbf (tief) ZUG'
                },
                {
                    id: '1:0013000',
                    name: 'Leipzig, Hauptbahnhof'
                },
                {
                    id: '1:0012995',
                    name: 'Leipzig, Hauptbahnhof/Westseite'
                }
            ],
        },
        {
            name: 'Leipzig, Gut Seehausen / Dingolfinger Str.',
            mappedStations: [
                {
                    id: '1:0019969',
                    name: 'Leipzig, Seehausen, Dingolfinger Str.',
                },
                {
                    id: '1:0011128',
                    name: 'Leipzig, Gut Seehausen'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof Karlsruher Str',
            mappedStations: [
                {
                    id: '1:8010186',
                    name: 'Leipzig Karlsruher Str ZUG',
                },
                {
                    id: '1:0011699',
                    name: 'Leipzig, S-Bahnhof Karlsruher Str.'
                }
            ],
        },
        {
            name: 'Leipzig, Mölkau Süd / Gottschalkstr.',
            mappedStations: [
                {
                    id: '1:0012396',
                    name: 'Leipzig, Mölkau Süd',
                },
                {
                    id: '1:0012269',
                    name: 'Leipzig, Mölkau, Gottschalkstr.'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof Stötteritz',
            mappedStations: [
                {
                    id: '1:8012194',
                    name: 'Leipzig-Stötteritz ZUG',
                },
                {
                    id: '1:0011336',
                    name: 'Leipzig, S-Bahnhof Stötteritz'
                }
            ],
        },
        {
            name: 'Leipzig, Lindenthal, Gemeindeamt / Hauptstr.',
            mappedStations: [
                {
                    id: '1:0012151',
                    name: 'Leipzig, Lindenthaler Hauptstr.',
                },
                {
                    id: '1:0012531',
                    name: 'Leipzig, Lindenthal, Gemeindeamt'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof Messe',
            mappedStations: [
                {
                    id: '1:0010824',
                    name: 'Leipzig, S-Bahnhof Messe',
                },
                {
                    id: '1:8012478',
                    name: 'Leipzig Messe ZUG'
                },
                {
                    id: '1:0011905',
                    name: 'Leipzig, Congress Center'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof Plagwitz',
            mappedStations: [
                {
                    id: '1:0010814',
                    name: 'Leipzig, S-Bahnhof Plagwitz',
                },
                {
                    id: '1:8010209',
                    name: 'Leipzig-Plagwitz ZUG'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof Leutzsch',
            mappedStations: [
                {
                    id: '1:0012707',
                    name: 'Leipzig, S-Bahnhof Leutzsch',
                },
                {
                    id: '1:8010207',
                    name: 'Leipzig-Leutzsch ZUG'
                }
            ],
        },
        {
            name: 'Leipzig, Breisgau-/Ringstr.',
            mappedStations: [
                {
                    id: '1:0023155',
                    name: 'Leipzig, Breisgau-/Ringstr.',
                },
                {
                    id: '1:0015828',
                    name: 'Leipzig, Ringstr.'
                }
            ],
        },
        {
            name: 'Leipzig, Allee-Center Süd',
            mappedStations: [
                {
                    id: '1:0023154',
                    name: 'Leipzig, Allee-Center Süd',
                },
                {
                    id: '1:8013070',
                    name: 'Leipzig, Allee-Center Süd ZUG'
                }
            ],
        },
        {
            name: 'Leipzig, Leopoldstr / Koburger Brücke',
            mappedStations: [
                {
                    id: '1:0011115',
                    name: 'Leipzig, Leopoldstr',
                },
                {
                    id: '1:0011003',
                    name: 'Leipzig, Koburger Brücke'
                }
            ],
        },
        {
            name: 'Leipzig, Anger-Crottendorf / Ostfriedhof',
            mappedStations: [
                {
                    id: '1:0011952',
                    name: 'Leipzig, Ostfriedhof',
                },
                {
                    id: '1:8010008',
                    name: 'Leipzig Anger-Crottendorf ZUG'
                },
                {
                    id: '1:0011950',
                    name: 'Leipzig, S-Bahnhof Anger-Crottendorf'
                }
            ],
        },
        {
            name: 'Leipzig, Thekla / Pleißenburgwerkstätten',
            mappedStations: [
                {
                    id: '1:0011900',
                    name: 'Leipzig, Pleißenburgwerkstätten',
                },
                {
                    id: '1:8012195',
                    name: 'Leipzig-Thekla ZUG'
                },
                {
                    id: '1:0013125',
                    name: 'Leipzig, Thekla, S-Bahnhof'
                }
            ],
        },
        {
            name: 'Leipzig, Coppiplatz',
            mappedStations: [
                {
                    id: '1:8080840',
                    name: 'Leipzig Coppiplatz ZUG',
                },
                {
                    id: '1:0012285',
                    name: 'Leipzig, S-Bahnhof Coppiplatz (Bus/Tram)'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof Slevogtstr.',
            mappedStations: [
                {
                    id: '1:8012204',
                    name: 'Leipzig Slevogtstraße ZUG',
                },
                {
                    id: '1:0020158',
                    name: 'Leipzig, S-Bahnhof Slevogtstr.'
                }
            ],
        },
        {
            name: 'Leipzig, Wilhelm-Leuschner-Platz',
            mappedStations: [
                {
                    id: '1:8012202',
                    name: 'Leipzig Wilhelm-Leuschner-Platz ZUG',
                },
                {
                    id: '1:0012992',
                    name: 'Leipzig, Wilhelm-Leuschner-Platz'
                }
            ],
        },
        {
            name: 'Leipzig, Knautkleeberg',
            mappedStations: [
                {
                    id: '1:0012217',
                    name: 'Leipzig, Knautkleeberg',
                },
                {
                    id: '1:8012192',
                    name: 'Leipzig-Knauthain ZUG'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof Gohlis',
            mappedStations: [
                {
                    id: '1:8012188',
                    name: 'Leipzig-Gohlis ZUG',
                },
                {
                    id: '1:0012969',
                    name: 'Leipzig, S-Bahnhof Gohlis'
                }
            ],
        },
        {
            name: 'Leipzig, Markt',
            mappedStations: [
                {
                    id: '1:8012186',
                    name: 'Leipzig Markt ZUG',
                },
                {
                    id: '1:0012145',
                    name: 'Leipzig, Markt'
                }
            ],
        },
        {
            name: 'Leipzig, S-Bahnhof MDR',
            mappedStations: [
                {
                    id: '1:8012187',
                    name: 'Leipzig MDR ZUG',
                },
                {
                    id: '1:0000165',
                    name: 'Leipzig, S-Bahnhof MDR'
                }
            ],
        },
        {
            name: 'Leipzig, Bästlein-/Schwantesstr./Bautznerstr.',
            mappedStations: [
                {
                    id: '1:0013538',
                    name: 'Leipzig, Bautzner/Bästleinstr.',
                },
                {
                    id: '1:0003639',
                    name: 'Leipzig, Bästlein-/Schwantesstr.'
                }
            ],
        },
        {
            name: 'Leipzig, Mockauer/Volbedingstr. / Nord',
            mappedStations: [
                {
                    id: '1:8012196',
                    name: 'Leipzig Nord ZUG',
                },
                {
                    id: '1:0011407',
                    name: 'Leipzig, Mockauer/Volbedingstr.'
                }
            ],
        },
        {
            name: 'Leipzig, Am Sportpark / Leutzsch',
            mappedStations: [
                {
                    id: '1:0011524',
                    name: 'Leipzig, Am Sportpark',
                },
                {
                    id: '1:0012558',
                    name: 'Leipzig, Leutzsch, Straßenbahnhof'
                }
            ],
        },
        {
            name: 'Leipzig, Geithainer Str. / Paunsdorf',
            mappedStations: [
                {
                    id: '1:0016305',
                    name: 'Leipzig, Geithainer Str.',
                },
                {
                    id: '1:0010856',
                    name: 'Leipzig, Bahnhof Paunsdorf'
                },
                {
                    id: '1:8010208',
                    name: 'Leipzig-Paunsdorf ZUG'
                }
            ],
        },
        {
            name: 'Leipzig, Gohlis-Nord / Virchowstr.',
            mappedStations: [
                {
                    id: '1:0011320',
                    name: 'Leipzig, Gohlis-Nord, Virchowstr.',
                },
                {
                    id: '1:0012967',
                    name: 'Leipzig, Gohlis-Nord'
                }
            ]
        },
        {
            name: 'Leipzig, S-Bahnhof Wahren',
            mappedStations: [
                {
                    id: '1:0012405',
                    name: 'Leipzig, S-Bahnhof Wahren',
                },
                {
                    id: '1:8012197',
                    name: 'Leipzig-Wahren ZUG'
                }
            ]
        },
        {
            name: 'Leipzig, Bayerischer Bahnhof',
            mappedStations: [
                {
                    id: '1:0010983',
                    name: 'Leipzig, Bayerischer Bahnhof',
                },
                {
                    id: '1:8012184',
                    name: 'Leipzig Bayerischer Bahnhof ZUG'
                }
            ]
        },
        {
            name: 'Leipzig, S-Bahnhof Möckern',
            mappedStations: [
                {
                    id: '1:0012974',
                    name: 'Leipzig, S-Bahnhof Möckern',
                },
                {
                    id: '1:8012193',
                    name: 'Leipzig-Möckern ZUG'
                }
            ]
        }
    ]
    composites.forEach(comp => comp.id = comp.mappedStations[0].id)
    return composites
}