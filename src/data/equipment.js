

var equipment = {
    opticalSight: {
        1: {
            name: "16Lab 6-24X56",
            rarity: 5,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "16Lab's optical sight of choice. Slap 16Lab's logo on a limited edition and you can sell it for ten times the price. Awesome, huh?",
            stats: {
                criticalHitRate: ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"]
            }
        },
        2: {
            name: "ACOG (4x)",
            rarity: 5,
            exclusive: true,
            usable: ["Agent 416"],
            description: "An optical sight that has been modified to the SHD's requirements. When fitted to a rifle, it improves effectiveness at middle to long range combat.",
            stats: {
                criticalHitRate: ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"]
            }
        },
        3: {
            name: "Advanced Infantry Sight",
            rarity: 5,
            exclusive: true,
            usable: ["Type 95", "Type 97"],
            description: "An integrated sight with wired transmission and a rangefinder, it is designed to enhance the battlefield awareness and combat adaptability of Type95 and Type97, allowing them to not reveal themselves while shooting from behind cover.",
            stats: {
                criticalHitRate: ["+18~24", "+19~26", "+21~28", "+23~31", "+25~33", "+27~36", "+28~38", "+30~40", "+32~43", "+34~45", "+36~48"],
                damage: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+2~4", "+2~4", "+3~4", "+3~4", "+3~5"]
            }
        },
        4: {
            name: "ART2",
            rarity: 5,
            exclusive: true,
            usable: ["M21"],
            description: "A scope for accurate firing. M21 delights in the distinctive golden eyepiece rim.",
            stats: {
                criticalHitRate: ["+17~24", "+18~26", "+20~28", "+22~31", "+23~33", "+25~36", "+27~38", "+28~40", "+30~43", "+32~45", "+34~48"],
                damage: ["+3~5", "+3~5", "+3~5", "+3~6", "+3~6", "+4~7", "+4~7", "+4~7", "+4~8", "+5~8", "+5~9"]
            }
        },
        5: {
            name: "BM 3-12X40",
            rarity: 2,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The 3-12x magnification optical sight manufactured by BM Corporation allows T-Dolls to hit the enemy's vital points more easily. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8"],
            }
        },
        6: {
            name: "FELIN System Sight",
            rarity: 5,
            exclusive: true,
            usable: ["FAMAS"],
            description: "Once a part of an advanced infantry combat system, this hardware incorporates an optical sight and an infrared laser into one single unit, allowing Fr FAMAS to flexibly adapt to the battle environment.",
            stats: {
                criticalHitRate: ["+17~24", "+18~26", "+20~28", "+22~31", "+23~33", "+25~36", "+27~38", "+28~40", "+30~43", "+32~45", "+34~48"],
                damage: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~3", "+1~3", "+1~3", "+1~3", "+1~3", "+2~4"],
                accuracy: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~3", "+1~3", "+1~3", "+1~3", "+1~3", "+2~4"]
            }
        },
        7: {
            name: "Gr G36 Hybrid Sight",
            rarity: 5,
            exclusive: true,
            usable: ["G36 Mod"],
            description: "A hybrid sight developed especially for Gr G36. It comprises of a 3x optical sight on the bottom and a red dot sight on top, allowing for flexible usage to suit the needs of the operational environment. Can only be equipped by Gr G36.",
            stats: {
                criticalHitRate: ["+17~24", "+18~26", "+20~28", "+22~31", "+23~33", "+25~36", "+27~38", "+28~40", "+30~43", "+32~45", "+34~48"],
                accuracy: ["+3~4", "+3~4", "+3~4", "+3~5", "+4~5", "+4~6", "+4~6", "+5~6", "+5~7", "+5~7", "+6~8"]
            }
        },
        8: {
            name: "K6-24X56",
            rarity: 5,
            exclusive: true,
            usable: ["Mosin-Nagant Mod"],
            description: "This modern optical sight installed on rails unleashes the full potential of Mosin-Nagant by increasing its accuracy and critical hit rate. Can only be equipped by Mosin-Nagant.",
            stats: {
                criticalHitRate: ["+18~25", "+19~27", "+21~30", "+23~32", "+25~35", "+27~37", "+28~40", "+30~42", "+32~45", "+34~47", "+36~50"],
                accuracy: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+3~4", "+3~4", "+3~5", "+3~5", "+3~5", "+4~6"]
            }
        },
        9: {
            name: "KST1P7",
            rarity: 5,
            exclusive: true,
            usable: ["AK-47", "Type 56-1"],
            description: "An optical scope developed by KST before the war, it is specially designed to fit onto the AK family of weapons. It is still a decent choice for the AK variants to this day.",
            stats: {
                criticalHitRate: ["+32", "+33", "+35", "+36", "+38", "+40", "+41", "+43", "+44", "+46", "+48"],
                criticalHitDamage: ["+10", "+10", "+11", "+11", "+12", "+12", "+13", "+13", "+14", "+14", "+15"]
            }
        },
        10: {
            name: "KST1P8",
            rarity: 5,
            exclusive: true,
            usable: ["AK-47", "Type 56-1"],
            description: "An optical scope meticulously developed by KST with accuracy and precision before the war, it is specially designed to fit onto the AK family of weapons. Due to its precision and durability, it is still favored for the AK variants to this day.",
            stats: {
                criticalHitRate: ["+32", "+33", "+35", "+36", "+38", "+40", "+41", "+43", "+44", "+46", "+48"],
                criticalHitDamage: ["+25", "+25", "+26", "+26", "+27", "+27", "+27", "+28", "+28", "+29", "+30"]
            }
        },
        11: {
            name: "KSTSP",
            rarity: 5,
            exclusive: true,
            usable: ["AK-47", "Type 56-1"],
            description: "An optical scope developed by KSTSP before the war, it is specially designed to fit onto the AK family of weapons. Due to its unrivaled precision, it is still the accessory of choice for the AK variants to this day.",
            stats: {
                criticalHitRate: ["+32", "+33", "+35", "+36", "+38", "+40", "+41", "+43", "+44", "+46", "+48"],
                criticalHitDamage: ["+40", "+40", "+40", "+41", "+41", "+42", "+42", "+42", "+43", "+43", "+44"]
            }
        },
        12: {
            name: "LRA 2-12x50",
            rarity: 3,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "A new model of optical sight developed by LRA Corporation. It provides a high magnification and a wide field of view. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+9~12", "+9~13", "+10~14", "+11~15", "+12~16", "+13~18", "+14~19", "+15~20", "+16~21", "+17~22", "+18~24"]
            }
        },
        13: {
            name: "No32 MKI",
            rarity: 5,
            exclusive: true,
            usable: ["Lee-Enfield"],
            description: "Telescopic sight produced exclusively for Lee Enfield No. 4 MK. I (T) at the beginning of the last century, furnished with an exquisite brass finish. The faded scope lens witnessed countless lives lost. Can only be equipped by Lee Enfield.",
            stats: {
                criticalHitRate: ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"],
                rateOfFire: ["+2", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+3", "+4"]
            }
        },
        14: {
            name: "PM 5-25X56",
            rarity: 5,
            exclusive: true,
            usable: ["Kar98k"],
            description: "The expensive German-made optical lens has always been the ultimate choice for snipers and photographers. For someone who has toured through 130 years of battlefields, this sophisticated sight will allow her to be even more serene. Can only be equipped by Kar98k.",
            stats: {
                criticalHitRate: ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"],
                criticalHitDamage: ["+10", "+11", "+12", "+13", "+14", "+15", "+16", "+17", "+18", "+19", "+20"]
            }
        },
        15: {
            name: "ZFG42",
            rarity: 5,
            exclusive: true,
            usable: ["FG42"],
            description: "ZF's optical sight for FG42. Its brass exterior has faded after more than a century, but you can still get a sense of the German style from the lens. Looking through it makes you feel like you've joined Magnum.",
            stats: {
                criticalHitRate: ["+13~17", "+14~18", "+15~20", "+16~21", "+17~23", "+18~24", "+20~26", "+21~27", "+22~29", "+23~30", "+24~32"],
                criticalHitDamage: ["+13~16", "+13~16", "+14~17", "+14~18", "+15~19", "+16~20", "+16~20", "+17~21", "+18~22", "+18~23", "+19~24"],
                rateOfFire: ["-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1"]
            }
        },
        16: {
            name: "VFL 6-24x56",
            rarity: 5,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "An excellent scope specially built for long-distance sniping, it is made from the best materials and optical components, ensuring outstanding and reliable performance. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+17~24", "+18~26", "+20~28", "+22~31", "+23~33", "+25~36", "+27~38", "+28~40", "+30~43", "+32~45", "+34~48"]
            }
        },
        17: {
            name: "PSO-1",
            rarity: 4,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "Possessing a compact and reliable design, the military-grade optical sight incorporates specialized reticle subtensions, allowing for ease of use on the battlefield. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+13~16", "+14~17", "+15~19", "+16~20", "+18~22", "+19~24", "+20~25", "+22~27", "+23~28", "+24~30", "+26~32"]
            }
        }
    },
    holographicSight: {
        1: {
            name: "AMP COMPSP",
            rarity: 5,
            exclusive: true,
            usable: ["UMP9"],
            description: "AMP's exclusive optical sight for UMP9. The main feature is that the built-in 4MOA crosshair is bright yellow, just the way UMP9 likes it. Can only be equipped by UMP9.",
            stats: {
                damage: ["+5~7", "+5~7", "+5~7", "+5~7", "+5~8", "+6~8", "+6~8", "+6~9", "+6~9", "+7~9", "+7~10"],
                accuracy: ["+6~10", "+6~10", "+6~10", "+6~11", "+6~11", "+6~12", "+7~12", "+7~12", "+7~13", "+8~13", "+8~14"],
                rateOfFire: ["-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3"]
            }
        },
        2: {
            name: "DO Reflex Sight",
            rarity: 5,
            exclusive: true,
            usable: ["Beretta Model 38 Mod"],
            description: "This reflex sight has a 7 MOA dot. Its small size and easy handling made it very popular in the pre-war civilian market. When attached to an M38 via a welded Picatinny rail, it greatly improves the user experience.",
            stats: {
                damage: ["+11", "+11", "+11", "+11", "+11", "+11", "+11", "+11", "+11", "+11", "+11"],
                accuracy: ["+14", "+14", "+14", "+14", "+14", "+14", "+14", "+14", "+14", "+14", "+14"],
                rateOfFire: ["-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4"]
            }
        },
        3: {
            name: "EOT 506",
            rarity: 2,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The Type 506 Holographic Sight manufactured by EOT Corporation. It looks pretty cool. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1"],
                damage: ["+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1"],
                rateOfFire: ["-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1"]
            }
        },
        4: {
            name: "EOT 512",
            rarity: 3,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The Type 512 Holographic Sight manufactured by EOT Corporation. It looks pretty cool. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+3~3"],
                damage: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~3"],
                rateOfFire: ["-2~2", "-2~2", "-2~2", "-2~2", "-2~2", "-2~2", "-2~2", "-2~2", "-2~2", "-2~2", "-2~2"]
            }
        },
        4: {
            name: "EOT 516",
            rarity: 4,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The Type 516 Holographic Sight manufactured by EOT Corporation. It looks very cool. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+3~5", "+3~5", "+3~5", "+3~5", "+3~5", "+3~6", "+3~6", "+3~6", "+3~6", "+3~6", "+4~7"],
                damage: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+2~4"],
                rateOfFire: ["-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3"]
            }
        },
        5: {
            name: "EOT 518",
            rarity: 5,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The Type 518 Holographic Sight manufactured by EOT Corporation. It looks super cool. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+6~10", "+6~10", "+6~10", "+6~11", "+6~11", "+7~12", "+7~12", "+7~12", "+7~13", "+8~13", "+8~14"],
                damage: ["+4~6", "+4~6", "+4~6", "+4~6", "+4~6", "+4~7", "+4~7", "+5~7", "+5~7", "+5~8", "+5~8"],
                rateOfFire: ["-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4"]
            }
        },
        6: {
            name: "EOT XPS3",
            rarity: 5,
            exclusive: true,
            usable: ["HK416"],
            description: "EOT's latest holographic sight. In addition to looking cool, it comes with a flip to side 3x magnifier scope, allowing it to be used under a wider range of situations. Can only be equipped by 416.",
            stats: {
                damage: ["+4~6", "+4~6", "+4~6", "+4~6", "+4~6", "+4~7", "+4~7", "+5~7", "+5~7", "+5~8", "+5~8"],
                accuracy: ["+6~10", "+6~10", "+6~10", "+6~11", "+6~11", "+7~12", "+7~12", "+7~12", "+7~13", "+8~13", "+8~14"],
                criticalHitRate: ["+12~15", "+12~16", "+13~17", "+14~18", "+15~19", "+16~20", "+16~21", "+17~22", "+18~23", "+19~24", "+20~25"]
            }
        },
        7: {
            name: "LED Weapon Light",
            rarity: 5,
            exclusive: true,
            usable: ["MP5"],
            description: "The bright LED flashlight is integrated into the handguard with a built-in lithium battery. It can be quickly turned on and off with the press of a button on the handguard. Can only be equipped by Gr MP5.",
            stats: {
                damage: ["+10", "+10", "+10", "+10", "+10", "+10", "+10", "+10", "+10", "+10", "+10"],
                accuracy: ["+15", "+15", "+15", "+15", "+15", "+15", "+15", "+15", "+15", "+15", "+15"],
                rateOfFire: ["-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4", "-4",]
            }
        }
    },
    redDotSight: {
        1: {
            name: "AMP COMPM2",
            rarity: 2,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The COMPML Red Dot Sight manufactured by AMP Corporation. Its only merit is its sturdiness. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3"],
                rateOfFire: ["-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1"]
            }
        },
        2: {
            name: "AMP COMPM4",
            rarity: 3,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The COMPML Red Dot Sight manufactured by AMP Corporation. Its design has been enhanced, increasing its sturdiness even more. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+4~6", "+4~6", "+4~7", "+5~7", "+5~8", "+6~9", "+6~9", "+6~10", "+7~10", "+7~11", "+8~12"],
                rateOfFire: ["-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1"]
            }
        },
        3: {
            name: "COG M150",
            rarity: 4,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The greatest advantage of COG Corporation's advanced red dot sight is that it does not require batteries to assist in aiming in any situation. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+7~10", "+7~11", "+8~12", "+9~13", "+9~14", "+10~15", "+11~16", "+11~17", "+12~18", "+13~19", "+14~20"],
                rateOfFire: ["-3~1", "-3~1", "-3~1", "-3~1", "-3~1", "-3~1", "-3~1", "-3~1", "-3~1", "-3~1", "-3~1"]
            }
        },
        4: {
            name: "CT 4X20",
            rarity: 5,
            exclusive: true,
            usable: ["M1918"],
            description: "Originally developed for the AR platform, this battle-proven scope has been retrofitted for M1918. Can only be equipped by M1918.",
            stats: {
                criticalHitRate: ["+3~5", "+3~5", "+3~6", "+3~6", "+4~7", "+4~7", "+4~8", "+5~8", "+5~9", "+5~9", "+6~10"],
                accuracy: ["+11~15", "+12~16", "+13~18", "+14~19", "+15~21", "+16~22", "+17~24" ,"+18~25", "+19~27", "+20~28", "+22~30"],
                rateOfFire: ["-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1"]
            }
        },
        5: {
            name: "ITI Mars",
            rarity: 5,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "An integrated red dot sight developed by ITI Corporation, it incorporates multiple functions without affecting shooting performance and is equipped with an anti-reflection system. Can be equipped by all except HG.",
            stats: {
                accuracy: ["+11~15", "+12~16", "+13~18", "+14~19", "+15~21", "+16~22", "+17~24" ,"+18~25", "+19~27", "+20~28", "+22~30"],
                rateOfFire: ["-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1"]
            }
        },
        6: {
            name: "Gr MG4 MGO",
            rarity: 5,
            exclusive: true,
            usable: ["MG4"],
            description: "A red dot sight optimized for machine guns by TJC. It boasts a 6x magnification and built-in rangefinder. The Bundeswehr camo makes it cost twice as much. Can only be equipped by Gr MG4.",
            stats: {
                criticalHitRate: ["+15", "+16", "+17", "+18", "+19", "+20", "+21", "+22", "+23", "+24", "+25"],
                accuracy: ["+18", "+19", "+21", "+23", "+25", "+27", "+28", "+30", "+32", "+34", "+36"],
                rateOfFire: ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"]
            }
        },
        7: {
            name: "MGO 6X48",
            rarity: 5,
            exclusive: true,
            usable: ["LWMMG"],
            description: "A red dot sight optimized for machine guns by TJC. It increases fire suppression efficiency with its 6x magnification and built-in rangefinder. Can only be equipped by LWMMG.",
            stats: {
                accuracy: ["+13~17", "+14~18", "+15~20", "+16~22", "+18~23", "+19~25", "+20~27", "+22~28", "+23~30", "+24~32", "+26~34"],
                damage: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2"],
                rateOfFire: ["-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1"]
            }
        },
        8: {
            name: "MGP Upgrade Kit",
            rarity: 5,
            exclusive: true,
            usable: ["M500"],
            description: "An upgrade kit manufactured by a renowned gun accessories firm. The M-LOK system grants incredible adaptability and the length of the stock is now more suited for the average Doll.",
            stats: {
                criticalDamage: ["+12~15", "+12~15", "+13~16", "+14~17", "+15~18", "+15~19", "+16~20", "+17~21", "+18~22", "+19~23", "+19~24"],
                accuracy: ["+11~15", "+12~16", "+13~18", "+14~19", "+15~21", "+16~22", "+17~24" ,"+18~25", "+19~27", "+20~28", "+22~30"],
                rateOfFire: ["-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1"]
            }
        },
        9: {
            name: "MPL M21",
            rarity: 5,
            exclusive: true,
            usable: ["Micro Uzi"],
            description: "Designed for the tough environment of the Middle East, this red dot sight has an optical fiber crosshair lighted by radium. No battery needed. Can only be equipped by Micro Uzi.",
            stats: {
                accuracy: ["+14~18", "+15~19", "+16~21", "+18~23", "+19~25", "+21~27", "+22~28", "+23~30", "+25~32", "+26~34", "+28~36"],
                rateOfFire: ["-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1", "-4~1"]
            }
        }
    },
    suppressor: {
        1: {
            name: "AC1 Suppressor",
            rarity: 2,
            exclusive: false,
            usable: ["HG", "SMG", "AR", "RF"],
            description: "A general use suppressor model manufactured by AC Corporation, it helps to keep T-Dolls concealed. Can be equipped by all except MGs and SGs.",
            stats: {
                criticalHitRate: ["+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~5"],
                evasion: ["+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2", "+2~2"]
            }
        },
        2: {
            name: "AC2 Suppressor",
            rarity: 3,
            exclusive: false,
            usable: ["HG", "SMG", "AR", "RF"],
            description: "An improved suppressor model manufactured by AC Corporation, it helps to keep T-Dolls concealed and reduces their chances of being detected. Can be equipped by all except MGs and SGs.",
            stats: {
                criticalHitRate: ["+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~9", "+7~9", "+7~9", "+7~9", "+7~10", "+7~10"],
                evasion: ["+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+4~4", "+4~4"]
            }
        },
        3: {
            name: "AC3 Suppressor",
            rarity: 4,
            exclusive: false,
            usable: ["HG", "SMG", "AR", "RF"],
            description: "An improved suppressor model manufactured by AC Corporation, it helps to keep T-Dolls concealed and reduces their chances of being detected. Can be equipped by all except MGs and SGs.",
            stats: {
                criticalHitRate: ["+9~11", "+9~11", "+9~11", "+10~12", "+10~12", "+10~13", "+11~13", "+11~14", "+11~14", "+12~14", "+12~15"],
                evasion: ["+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~6", "+4~6", "+5~6", "+5~6", "+5~6", "+5~7"]
            }
        },
        4: {
            name: "AC4 Suppressor",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG", "AR", "RF"],
            description: "A suppressor model specially developed for special operations, it is highly effective at keeping T-Dolls concealed and reduces their chances of being detected. Can be equipped by all except MGs and SGs.",
            stats: {
                criticalHitRate: ["+12~15", "+12~15", "+12~16", "+13~16", "+13~17", "+14~17", "+14~18", "+14~18", "+15~19", "+15~19", "+16~20"],
                evasion: ["+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~9", "+7~9", "+7~9", "+7~9", "+7~10", "+7~10"]
            }
        },
        5: {
            name: "Antique Kaleidoscope",
            rarity: 5,
            exclusive: true,
            usable: ["Henrietta"],
            description: "A kaleidoscope of intricate craftsmanship. Its owner doesn't care if it's genuine or counterfeit. What matters to her is the sentimental value it carries.",
            stats: {
                criticalHitRate: ["+12~15", "+12~16", "+13~17", "+14~18", "+15~19", "+16~20", "+16~21", "+17~22", "+18~23", "+19~24", "+20~25"],
                evasion: ["+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~9", "+7~9", "+7~9", "+7~9", "+7~10", "+7~10"],
                accuracy: ["+1~3", "+1~3", "+1~3", "+1~3", "+1~3", "+1~4", "+1~4", "+1~4", "+1~4", "+1~4", "+1~5"]
            }
        },
        6: {
            name: "BPR4 & SRM6",
            rarity: 5,
            exclusive: true,
            usable: ["MDR"],
            description: "An OSS suppressor kit designed for .308 and 7.62mm caliber firearms. Due to the modular structure and chic look, it has gone viral on Griffin's discussion board. A certain frequent user of the anonymous forum obviously won't miss out on it.",
            stats: {
                criticalHitRate: ["+17~24", "+18~26", "+20~28", "+22~31", "+23~33", "+25~36", "+27~38", "+28~40", "+30~43", "+32~45", "+34~48"],
                damage: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+3~4", "+3~4", "+3~5", "+3~5", "+3~5", "+4~6"],
                evasion: ["+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~9", "+7~9", "+7~9", "+7~9", "+7~10", "+7~10"]
            }
        },
        7: {
            name: "M1895 Suppressor",
            rarity: 5,
            exclusive: true,
            usable: ["Nagant Revolver Mod"],
            description: "Most revolvers cannot be suppressed due to the large physical gaps in their designs, but the unique structure of M1895 allows for the installation of a suppressor. It becomes very effective when paired with special reduced noise ammunition. Can only be equipped by M1895.",
            stats: {
                criticalHitRate: ["+12~15", "+12~15", "+12~16", "+13~16", "+13~17", "+14~17", "+14~18", "+14~18", "+15~19", "+15~19", "+16~20"],
                evasion: ["+7~10", "+7~10", "+7~10", "+7~11", "+8~11", "+8~12", "+8~12", "+8~13", "+9~13", "+9~13", "+9~14"],
                accuracy: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~3", "+1~3", "+1~3", "+1~3", "+1~3", "+2~4"]
            }
        },
        8: {
            name: "Osprey45 Silencer",
            rarity: 5,
            exclusive: true,
            usable: ["Agent Vector"],
            description: "A silencer in widespread service with the SHD. Mainly used on .45 Vectors. Its excellent performance and rugged appearance have won it much acclaim.",
            stats: {
                criticalHitRate: ["+15", "+15", "+16", "+16", "+17", "+17", "+18", "+18", "+19", "+19", "+20"],
                evasion: ["+8", "+8", "+8", "+8", "+8", "+9", "+9", "+9", "+9", "+10", "+10"]
            }
        },
        9: {
            name: "OSS Silencer",
            rarity: 5,
            exclusive: true,
            usable: ["M3"],
            description: "A suppressor developed by OSS back in the day for covert operations. In addition to concealing M3, it also comes with a cowhide cover that the Commander can use as emergency field ration.",
            stats: {
                criticalHitRate: ["+15~20", "+15~20", "+16~21", "+16~22", "+17~23", "+18~24", "+18~24", "+19~25", "+19~26", "+20~27", "+20~27"],
                damage: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~3", "+1~3", "+1~3", "+1~3", "+1~3", "+2~4"],
                evasion: ["+12~14", "+12~14", "+13~15", "+13~16", "+14~16", "+15~17", "+15~18", "+16~18", "+16~19", "+17~20", "+18~21"]
            }
        },
        10: {
            name: "PPK Silencer",
            rarity: 5,
            exclusive: true,
            usable: ["PPK"],
            description: "Other than lipstick, a lady will also always need a suppressor in her bag. The former keeps people talking, and the latter will ensure their silence forever.",
            stats: {
                criticalHitRate: ["+15~20", "+15~21", "+16~22", "+17~23", "+18~24", "+18~25", "+19~26", "+20~27", "+21~28", "+21~29", "+22~30"],
                evasion: ["+11~13", "+11~13", "+11~14", "+12~14", "+12~15", "+13~15", "+13~16", "+14~16", "+14~17", "+14~17", "+15~18"]
            }
        },
        11: {
            name: "STEN Suppressor",
            rarity: 5,
            exclusive: true,
            usable: ["Sten MkII Mod"],
            description: "Once widely used in the battlefields of Europe and the Pacific theater, this quaint-looking suppressor comes standard with a canvas cover that shields against heat generated during firing. Can only be equipped by STEN MkⅡ.",
            stats: {
                criticalHitRate: ["+12~15", "+12~15", "+12~16", "+13~16", "+13~17", "+14~17", "+14~18", "+14~18", "+15~19", "+15~19", "+16~20"],
                evasion: ["+8~11", "+8~11", "+8~11", "+8~12", "+9~12", "+9~13", "+9~13", "+14~16", "+10~14", "+10~14", "+11~15"]
            }
        },
        12: {
            name: "Type 64 Exclusive Suppressor",
            rarity: 5,
            exclusive: true,
            usable: ["Type 64"],
            description: "This quaint suppressor allows Type 64 to silently blend into the darkness of the rainforest night while increasing her critical strike chance. Can only be equipped by Type 64.",
            stats: {
                criticalHitRate: ["+12~15", "+12~15", "+12~16", "+13~16", "+13~17", "+14~17", "+14~18", "+14~18", "+15~19", "+15~19", "+16~20"],
                evasion: ["+8~11", "+8~11", "+8~11", "+8~12", "+9~12", "+9~13", "+9~13", "+14~16", "+10~14", "+10~14", "+11~15"]
            }
        }
    },
    nightBattleEquipment: {
        1: {
            name: "16Lab Infrared Designator",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "An infrared designator system specially developed by 16Lab. Much of its superfluous functions and weight have been removed, leaving behind a truly practical night battle equipment that allows T-Dolls to perform to their fullest potential. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100"]
            }
        },
        2: {
            name: "Black Cat",
            rarity: 5,
            exclusive: true,
            usable: ["Fail"],
            description: "A searing light manifested from a chaotic soul of an alternate world. It seeks to remind you, who lost in the darkness, to never forget, \"I will always break the rules, no matter how many times!\"",
            stats: {
                nightVision: ["+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100"],
                boostAbilityEffectiveness: ["+25", "+25", "+25", "+25", "+25", "+25", "+25", "+25", "+25", "+25", "+25"]
            }
        },
        3: {
            name: "Glorylight",
            rarity: 5,
            exclusive: true,
            usable: ["Clear"],
            description: "A radiant light born from a clear soul of an alternate world. It seeks to bring you, who is lost in the darkness, hope and strength. \"Glory day, glory light, you are the only one, you are the light!\"",
            stats: {
                nightVision: ["+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100"],
                boostAbilityEffectiveness: ["+33", "+33", "+33", "+33", "+33", "+33", "+33", "+33", "+33", "+33", "+33"]
            }
        },
        4: {
            name: "PEQ-15",
            rarity: 4,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "An improved model of the ATPIAL infrared designator issued by IOP Corporation for their T-Dolls, it effectively increases the T-Dolls' combat efficiency during nighttime. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85"],
            }
        },
        5: {
            name: "PEQ-16A",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "A custom model of the ATPIAL infrared designator issued by IOP Corporation for their T-Dolls, it is able to fulfill all their operational needs when battling at night. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100"],
            }
        },
        6: {
            name: "PEQ-2",
            rarity: 2,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "An early model ATPIAL infrared designator issued by IOP Corporation for their T-Dolls. Now T-Dolls can hit things at night! Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55"],
            }
        },
        7: {
            name: "PEQ-5",
            rarity: 3,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The standard model ATPIAL infrared designator issued by IOP Corporation for their T-Dolls. Much of the early model's deficiencies had been fixed in this model, but its battery still runs out very quickly. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70"],
            }
        },
        8: {
            name: "PKN03M Night Vision Scope",
            rarity: 5,
            exclusive: true,
            usable: ["9A-91"],
            description: "A night vision scope developed under the request of the Ministry of Internal Affairs. It has a 3x magnification capability and an infrared designator, allowing 9A-91 to silently strike enemy vital points in the dead of night.",
            stats: {
                damage: ["+5", "+5", "+5", "+5", "+6", "+6", "+6", "+7", "+7", "+7", "+8"],
                nightVision: ["+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100"]
            }
        }
    },
    highVelocityAmmo: {
        1: {
            name: ".300BLK High-Velocity Ammo",
            rarity: 5,
            exclusive: true,
            usable: ["ST AR-15"],
            description: "The .300 Blackout high-velocity ammunition was specially developed by 16Lab and is recommended for use with a suppressor. Can only be equipped by ST AR-15.",
            stats: {
                damage: ["+12~16", "+12~16", "+13~17", "+14~18", "+14~19", "+15~20", "+16~21", "+17~22", "+17~23", "+18~24", "+19~25"],
                accuracy: ["-1~5", "-1~5", "-1~5", "-1~5", "-1~5", "-1~5", "-1~5", "-1~5", "-1~5", "-1~5", "-1~5"]
            }
        },
        2: {
            name: "5.56mm HV rounds (Explosive)",
            rarity: 5,
            exclusive: true,
            usable: ["Agent 416"],
            description: "Modified from ordinary 5.56mm high velocity rounds. They explode upon hitting an enemy, thus increasing DPS. Supposedly, they have the ability to draw targets' attention.",
            stats: {
                damage: ["+12", "+12", "+13", "+14", "+15", "+16", "+17", "+17", "+18", "+19", "+20"],
            }
        },
        3: {
            name: "7.92 KURZ",
            rarity: 5,
            exclusive: true,
            usable: ["StG44 Mod"],
            description: "This 7.9mm ammunition developed for StG44 is one of the world's first intermediate cartridges. The use of steel casing due to a lack of brass gives it a stylish and unique look. Can only be equipped by StG44.",
            stats: {
                damage: ["+10~14", "+10~15", "+11~16", "+12~17", "+13~18", "+13~19", "+14~20", "+15~21", "+16~22", "+16~23", "+17~24"],
            }
        },
        3: {
            name: "9x39mm SPP",
            rarity: 5,
            exclusive: true,
            usable: ["OTs-12"],
            description: "The new 9x39mm round comes with better armor penetration than other bullets of the same caliber. The harmless-looking blue tip masks an astonishingly destructive force that mustn't be taken lightly.",
            stats: {
                criticalDamage: ["+6~10", "+6~10", "+6~11", "+6~11", "+7~12", "+7~12", "+7~13", "+8~13", "+8~14", "+8~14", "+9~15"],
                damage: ["+8~12", "+8~12", "+9~13", "+9~14", "+10~15", "+10~16", "+11~17", "+11~17", "+12~18", "+13~19", "+13~20"]
            }
        },
        4: {
            name: "APCR High-Velocity Ammo",
            rarity: 5,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's experimental APCR high-velocity ammunition integrates the idea of armor-piercing ammunition and uses a different design methodology to increase its lethality. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+8~12", "+8~12", "+9~13", "+9~14", "+10~15", "+10~16", "+11~17", "+11~17", "+12~18", "+13~19", "+13~20"]
            }
        },
        5: {
            name: "FMJ High-Velocity Ammo",
            rarity: 2,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's assault rifle-specific FMJ high-velocity ammunition effectively boosts the output of assault rifles through high quality, high pressure gunpowder. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2"]
            }
        },
        6: {
            name: "JHP High-Velocity Ammo",
            rarity: 4,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's assault rifle-specific JHP high-velocity ammunition was developed with the experience gained from previous bullet designs and experimentations, greatly increasing its damaging capabilities. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+5~7", "+5~7", "+5~8", "+6~8", "+6~9", "+7~9", "+7~10", "+7~10", "+8~11", "+8~12", "+9~12"]
            }
        },
        7: {
            name: "JSP High-Velocity Ammo",
            rarity: 3,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's assault rifle-specific JSP high-velocity ammunition uses an experimental bullet design to further increase the output of assault rifles. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+3~4", "+3~4", "+3~4", "+3~5", "+4~5", "+4~6", "+4~6", "+5~6", "+5~7", "+5~7", "+6~8"]
            }
        },
        8: {
            name: "SP6 Subsonic Ammo",
            rarity: 5,
            exclusive: true,
            usable: ["AS Val"],
            description: "Subsonic ammunition developed for use with a suppressor. Its steel tip makes it highly versatile. Can only be equipped by AS Val.",
            stats: {
                damage: ["+10~14", "+10~15", "+11~16", "+12~17", "+13~18", "+13~19", "+14~20", "+15~21", "+16~22", "+16~23", "+17~24"]
            }
        }
    },
    hollowPointAmmo: {

    },
    armorPiercingAmmo: {

    },
    buckshotAmmo: {

    },
    slugAmmo: {

    },
    exoskeleton: {

    },
    ammunitionBox: {

    },
    camouflageCloak: {

    },
    armorPlate: {

    },
    chip: {

    }
}