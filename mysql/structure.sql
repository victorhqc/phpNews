CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int(10) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `news` (
  `idNew` int(10) NOT NULL AUTO_INCREMENT,
  `idUser` int(10) NOT NULL,
  `title` varchar (200),
  `message` text,
  KEY `idUser` (`idUser`),
  PRIMARY KEY (`idNew`),
  CONSTRAINT `news_idUser` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `archives` (
  `idArchive` int(10) NOT NULL AUTO_INCREMENT,
  `idNew` int(10) NOT NULL,
  `archive` varchar(100) NOT NULL,
  KEY `idNew` (`idNew`),
  PRIMARY KEY (`idArchive`),
  CONSTRAINT `archives_idNew` FOREIGN KEY (`idNew`) REFERENCES `news` (`idNew`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `tags` (
  `idTag` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50),
  PRIMARY KEY (`idTag`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsTags` (
  `idTagNew` int(10) NOT NULL AUTO_INCREMENT,
  `idTag` int(10) NOT NULL,
  `idNew` int(10) NOT NULL,
  PRIMARY KEY (`idTagNew`),
  KEY `idTag` (`idTag`),
  KEY `idNew` (`idNew`),
  CONSTRAINT `newsTags_idTag` FOREIGN KEY (`idTag`) REFERENCES `tags` (`idTag`) ON DELETE CASCADE,
  CONSTRAINT `newsTags_idNew` FOREIGN KEY (`idNew`) REFERENCES `news` (`idNew`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;