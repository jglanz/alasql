if (typeof exports === 'object') {
  var assert = require('assert');
  var alasql = require('..');
} else {
  __dirname = '.';
}

if (typeof exports != 'object') {
  describe('Test 155a - InsexedDB INSERT+CHANGES', function () {
    it('1. Multiple lines async', function (done) {
      this.timeout(5000);
      console.log("hello2");
      alasql.promise(
        'DROP IndexedDB DATABASE IF EXISTS test155a; \
        CREATE IndexedDB DATABASE if not exists test155a; \
        ATTACH IndexedDB DATABASE test155a; \
        use test155a; \
        drop table if exists one; \
        CREATE TABLE one (a string);\
        insert into one values (\'Moscow\'),(\'Paris\'),(\'Minsk\'),(\'Riga\'),(\'Tallinn\')').then(
        function (res) {
          console.log("test out", res);

          try {
            assert.deepEqual(res, [1, 1, 1, 1, 0, 1,5]);
          } catch (err) {
            done(err);
          }

          alasql(
            'SELECT changes()',
            [],
            function (res, err) {
              console.log(res);
              if (err) {
                return done(err);
              }

              try {
                assert.deepEqual(Object.values(res[0]), [5]);
                done();
              } catch (err) {
                done(err);
              }

            }
          );
        })
        .catch(function (err) {
          console.error("error", err);
          done(err);
        });
    });
  });
}

