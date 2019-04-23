exports.getCompositeStations = function () {
    const composites = [
        {
            name: 'Hauptbahnhof',
            mappedStations: [
                {
                    id: 'ostseite_id',
                    name: 'Hauptbahnhof, Ostseite'
                },
                {
                    id: 'westseite_id',
                    name: 'Hauptbahnhof, Westseite'
                }
            ],
        }
    ]
    composites.forEach(comp => comp.id = comp.mappedStations.map(st => st.id))
    return composites
}