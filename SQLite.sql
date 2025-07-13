-- SQLite
SELECT x, y, COUNT(*) as count FROM pixels GROUP BY x, y HAVING count > 1;