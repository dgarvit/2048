angular.module('twoZeroFourEight').run(['$templateCache', function($templateCache) {
    'use strict';

    $templateCache.put('/static/html/grid.html', "<div id=\"game\">\n" + "  <div class=\"grid-container\">\n" + "    <div class=\"cell\" ng-repeat=\"cell in ngModel.grid track by $index\"></div>\n" + "  </div>\n" + "\n" + "  <div class=\"tile-container\">\n" + "    <div tile \n" + "          ng-model='tile'\n" + "          ng-repeat='tile in ngModel.tiles track by $id(tile.id || $index)'></div>\n" + "  </div>\n" + "</div>");

    $templateCache.put('scripts/grid/tile.html', "<div ng-if='ngModel' class=\"tile position-{{ ngModel.x }}-{{ ngModel.y }} tile-{{ ngModel.value }}\" \n" + "  ng-class=\"{ 'tile-merged': ngModel.merged}\">\n" + "  <div class=\"tile-inner\">\n" + "    {{ ngModel.value }}\n" + "  </div>\n" + "</div>\n");

}
]);