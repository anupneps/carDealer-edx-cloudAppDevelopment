from django.db import models
from django.utils.timezone import now

# Create your models here.

# <HINT> Create a Car Make model `class CarMake(models.Model)`:
# - Name
# - Description
# - Any other fields you would like to include in car make model
# - __str__ method to print a car make object

class CarMake(models.Model):
    Name = models.CharField(null=False, max_length=30, default='CarMake')
    Description = models.CharField(null=False, max_length=1000, default='Description')

    def __str__(self):
        return "Name: " + self.Name + "," + \
               "Description: " + self.Description

class CarModel(models.Model):
    Name = models.CharField(null=False, max_length=30, default='CarModel')
    DealerId = models.IntegerField(null=False, default=0)
    Type = models.CharField(null=False, max_length=30, default='Type')
    Year = models.DateField(null=False, default=now)
    CarMake = models.ForeignKey(CarMake, on_delete=models.CASCADE)

    def __str__(self):
        return "Name: " + self.Name + "," + \
               "DealerId: " + str(self.DealerId) + "," + \
               "Type: " + self.Type + "," + \
               "Year: " + str(self.Year) + "," + \
               "CarMake: " + str(self.CarMake)

# class CarDealer:
#     def __init__(self, id, city, state, st, address, zip, lat, long, short_name, full_name):
#         self.id = id
#         self.city = city
#         self.state = state
#         self.st = st
#         self.address = address
#         self.zip = zip
#         self.lat = lat
#         self.long = long
#         self.short_name = short_name
#         self.full_name = full_name

#     def __str__(self):
#         return (
#             f"CarDealer(id={self.id}, city='{self.city}', state='{self.state}', st='{self.st}', "
#             f"address='{self.address}', zip='{self.zip}', lat={self.lat}, long={self.long}, "
#             f"short_name='{self.short_name}', full_name='{self.full_name}')"
#         )

# class DealerReview:
#     def __init__(self, id, name, dealership, review, purchase, purchase_date, car_make, car_model, car_year):
#         self.id = id
#         self.name = name
#         self.dealership = dealership
#         self.review = review
#         self.purchase = purchase
#         self.purchase_date = purchase_date
#         self.car_make = car_make
#         self.car_model = car_model
#         self.car_year = car_year

#     def __str__(self):
#         return (
#             f"CarReview(id={self.id}, name='{self.name}', dealership={self.dealership}, "
#             f"review='{self.review}', purchase={self.purchase}, purchase_date='{self.purchase_date}', "
#             f"car_make='{self.car_make}', car_model='{self.car_model}', car_year={self.car_year})"
#         )
# <HINT> Create a Car Model model `class CarModel(models.Model):`:
# - Many-To-One relationship to Car Make model (One Car Make has many Car Models, using ForeignKey field)
# - Name
# - Dealer id, used to refer a dealer created in cloudant database
# - Type (CharField with a choices argument to provide limited choices such as Sedan, SUV, WAGON, etc.)
# - Year (DateField)
# - Any other fields you would like to include in car model
# - __str__ method to print a car make object


# <HINT> Create a plain Python class `CarDealer` to hold dealer data


# <HINT> Create a plain Python class `DealerReview` to hold review data
