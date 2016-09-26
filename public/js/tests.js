function ok(expr, msg) {
    if (!expr) throw new Error(msg);
}

suite('Fleet');
test('Purchase Small Ship', function () {
    resources.metal.amount = 500;
    fleet.methods.purchase(1);

    ok(buildings.shipyard.docks.small.current == 1, "There should be one ship after purchasing");
    ok(resources.metal.amount == 0, "500 metal should have been deducted");

    resources.metal.amount = 2500;

    fleet.methods.purchase(1);
    fleet.methods.purchase(1);
    // only three of these should actually work
    fleet.methods.purchase(1);

    ok(buildings.shipyard.docks.small.current == 3, "There should be a limit of three ships");
    ok(resources.metal.amount == 1500, "Only two ships should have been charged for");
});

test('Purchase Medium Ship', function () {
    resources.metal.amount = 1500;
    fleet.methods.purchase(2);

    ok(buildings.shipyard.docks.medium.current == 1, "There should be one medium ship after purchasing");
    ok(resources.metal.amount == 0, "1500 metal should have been deducted");

    resources.metal.amount = 6000;

    fleet.methods.purchase(2);
    fleet.methods.purchase(2);
    // only three of these should actually work
    fleet.methods.purchase(2);

    ok(buildings.shipyard.docks.medium.current == 3, "There should be a limit of three ships");
    ok(resources.metal.amount == 3000, "Only two ships should have been charged for");
});

test('Purchase Large Ship', function () {
    resources.metal.amount = 5000;
    fleet.methods.purchase(3);

    ok(buildings.shipyard.docks.large.current == 1, "There should be one medium ship after purchasing");
    ok(resources.metal.amount == 0, "5000 metal should have been deducted");

    resources.metal.amount = 50000;

    fleet.methods.purchase(3);
    fleet.methods.purchase(3);
    // only three of these should actually work
    fleet.methods.purchase(3);

    ok(buildings.shipyard.docks.large.current == 3, "There should be a limit of three ships");
    ok(resources.metal.amount == 40000, "Only two ships should have been charged for");

});

suite('Resource Storage');
test('Hydrogen Storage', function () {
    ok(resources.hydrogen.maxStorage == 2000, "Initial storage should be 2000");
    resources.metal.amount = 100;
    buildings.storage.hydrogen.purchase();

    ok(resources.hydrogen.maxStorage == 2500, "Buying a hydrogen tank should increase the amount of storage by 500");
    ok(resources.metal.amount == 0, "Buying a hydrogen tank should cost 100 metal");

});
test('Food Storage', function () {
    ok(resources.food.maxStorage == 2000, "Initial storage should be 2000");
    resources.metal.amount = 100;
    buildings.storage.food.purchase();

    ok(resources.food.maxStorage == 2500, "Buying a hydrogen tank should increase the amount of storage by 500");
    ok(resources.metal.amount == 0, "Buying a hydrogen tank should cost 100 metal");

});
test('Metal Storage', function () {
    ok(resources.metal.maxStorage == 2000, "Initial storage should be 2000");
    resources.metal.amount = 100;
    buildings.storage.metal.purchase();

    ok(resources.metal.maxStorage == 2500, "Buying a hydrogen tank should increase the amount of storage by 500");
    ok(resources.metal.amount == 0, "Buying a hydrogen tank should cost 100 metal");

});

suite('Housing');
test('Apartment', function () {

    ok(population.currentPopulationCap == 30, "default pop cap should be 30");
    buildings.housing.apartment.purchase();
    ok(population.currentPopulationCap == 30, "pop cap should still be 30, as we can't afford a house");
    resources.metal.amount = 50;
    buildings.housing.apartment.purchase();
    ok(population.currentPopulationCap == 32, "Now that we have an apartment, the cap should be 32");

    ok(buildings.housing.apartment.metalCost == 55, "Metal cost should increase by 5");


});
