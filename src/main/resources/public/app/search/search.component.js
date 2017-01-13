angular.
	module('search').
	component('search', {
		templateUrl: 'app/search/search.template.html',
		controller: ['$scope', '$http', '$mdSidenav', 'Schedules',
			function ListViewController($scope, $http, $mdSidenav, Schedules) {
				var self = this;
				
				self.terms = [];
				self.termInd = 0;
				
				self.schedules = Schedules;
				
				$http.get('api/v1/allcourses').success(function (data) {
					self.terms = data;
					$scope.$emit('SearchReady')
				}).error(function (data, status) {
					console.log('Error: ' + data);
				});
				
				self.courses = [];
				
				self.addCourse = function() {
					  // !!! change selectedItem to self.selectedItem ???
					
					  if (self.searchText && self.courses.indexOf(self.selectedItem) == -1) {
						  self.courses.push(self.selectedItem);
					  }
				
					  self.searchText = '';
				  }
				
				self.noCourses = function() {
					return self.courses.length == 0;
				}
				
				self.removeCourses = function () {
					  self.courses = [];
				}
				
				self.sections = [
					  {name: 'LEC', selected: false},
					  {name: 'TUT', selected: false},
					  {name: 'TST', selected: false},
					  {name: 'LAB', selected: false},
					  {name: 'SEM', selected: false},
					  {name: 'PRJ', selected: false},
				];
				
				self.classTime = '0';
				
				self.dayLength = '0';
				
				self.omitClosed = false;
				
				self.getSchedules = function () {
					path = '/api/v1/schedules?';
					path += 'term=' + self.terms[self.termInd].code;
					for (var i = 0; i < self.courses.length; ++i) {
						path += '&courses=' + self.courses[i].replace(/\s+/g, '');
					}
					for (var i = 0; i < self.sections.length; ++i) {
						var section = self.sections[i];
						if (section.selected) {
							path += '&ignore=' + section.name;
						}
					}
					path += '&classtime=' + self.classTime;
					path += '&daylength=' + self.dayLength;
					path += '&omitclosed=' + (self.omitClosed ? '1' : '0');
					  
					path = '/api/v1/schedules?term=1171&courses=CS240&courses=CS241&courses=CS251&courses=STV205&classtime=1&daylength=2&omitclosed=1';
					
					var result = Schedules.getSchedules(path, $mdSidenav('left').toggle);
				}			
		}
	]
});