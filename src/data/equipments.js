/*
    This list of equipments will contain information about all equipments used by the T-Dolls in the game in JSON format.
*/



var equipments = {
    opticalSight: [
        {
            name: "16Lab 6-24X56",
            rarity: 5,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "16Lab's optical sight of choice. Slap 16Lab's logo on a limited edition and you can sell it for ten times the price. Awesome, huh?",
            stats: {
                criticalHitRate: ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"]
            }
        },
        {
            name: "ACOG (4x)",
            rarity: 5,
            exclusive: true,
            usable: ["Agent 416"],
            description: "An optical sight that has been modified to the SHD's requirements. When fitted to a rifle, it improves effectiveness at middle to long range combat.",
            stats: {
                criticalHitRate: ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"]
            }
        },
        {
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
        {
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
        {
            name: "BM 3-12X40",
            rarity: 2,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "The 3-12x magnification optical sight manufactured by BM Corporation allows T-Dolls to hit the enemy's vital points more easily. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8", "+5~8"],
            }
        },
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
            name: "LRA 2-12x50",
            rarity: 3,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "A new model of optical sight developed by LRA Corporation. It provides a high magnification and a wide field of view. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+9~12", "+9~13", "+10~14", "+11~15", "+12~16", "+13~18", "+14~19", "+15~20", "+16~21", "+17~22", "+18~24"]
            }
        },
        {
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
        {
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
        {
            name: "PSO-1",
            rarity: 4,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "Possessing a compact and reliable design, the military-grade optical sight incorporates specialized reticle subtensions, allowing for ease of use on the battlefield. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+13~16", "+14~17", "+15~19", "+16~20", "+18~22", "+19~24", "+20~25", "+22~27", "+23~28", "+24~30", "+26~32"]
            }
        },
        {
            name: "VFL 6-24x56",
            rarity: 5,
            exclusive: false,
            usable: ["SMG", "AR", "MG", "RF", "SG"],
            description: "An excellent scope specially built for long-distance sniping, it is made from the best materials and optical components, ensuring outstanding and reliable performance. Can be equipped by all except HG.",
            stats: {
                criticalHitRate: ["+17~24", "+18~26", "+20~28", "+22~31", "+23~33", "+25~36", "+27~38", "+28~40", "+30~43", "+32~45", "+34~48"]
            }
        },
        {
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
        }
    ],
    holographicSight: [
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
    ],
    redDotSight: [
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
    ],
    suppressor: [
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
    ],
    nightBattleEquipment: [
        {
            name: "16Lab Infrared Designator",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "An infrared designator system specially developed by 16Lab. Much of its superfluous functions and weight have been removed, leaving behind a truly practical night battle equipment that allows T-Dolls to perform to their fullest potential. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100", "+100"]
            }
        },
        {
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
        {
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
        {
            name: "PEQ-15",
            rarity: 4,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "An improved model of the ATPIAL infrared designator issued by IOP Corporation for their T-Dolls, it effectively increases the T-Dolls' combat efficiency during nighttime. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85", "+76~85"],
            }
        },
        {
            name: "PEQ-16A",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "A custom model of the ATPIAL infrared designator issued by IOP Corporation for their T-Dolls, it is able to fulfill all their operational needs when battling at night. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100", "+91~100"],
            }
        },
        {
            name: "PEQ-2",
            rarity: 2,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "An early model ATPIAL infrared designator issued by IOP Corporation for their T-Dolls. Now T-Dolls can hit things at night! Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55", "+51~55"],
            }
        },
        {
            name: "PEQ-5",
            rarity: 3,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The standard model ATPIAL infrared designator issued by IOP Corporation for their T-Dolls. Much of the early model's deficiencies had been fixed in this model, but its battery still runs out very quickly. Can only be equipped by SMGs, HGs, and ARs.",
            stats: {
                nightVision: ["+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70", "+61~70"],
            }
        },
        {
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
    ],
    highVelocityAmmo: [
        {
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
        {
            name: "5.56mm HV rounds (Explosive)",
            rarity: 5,
            exclusive: true,
            usable: ["Agent 416"],
            description: "Modified from ordinary 5.56mm high velocity rounds. They explode upon hitting an enemy, thus increasing DPS. Supposedly, they have the ability to draw targets' attention.",
            stats: {
                damage: ["+12", "+12", "+13", "+14", "+15", "+16", "+17", "+17", "+18", "+19", "+20"],
            }
        },
        {
            name: "7.92 KURZ",
            rarity: 5,
            exclusive: true,
            usable: ["StG44 Mod"],
            description: "This 7.9mm ammunition developed for StG44 is one of the world's first intermediate cartridges. The use of steel casing due to a lack of brass gives it a stylish and unique look. Can only be equipped by StG44.",
            stats: {
                damage: ["+10~14", "+10~15", "+11~16", "+12~17", "+13~18", "+13~19", "+14~20", "+15~21", "+16~22", "+16~23", "+17~24"],
            }
        },
        {
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
        {
            name: "APCR High-Velocity Ammo",
            rarity: 5,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's experimental APCR high-velocity ammunition integrates the idea of armor-piercing ammunition and uses a different design methodology to increase its lethality. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+8~12", "+8~12", "+9~13", "+9~14", "+10~15", "+10~16", "+11~17", "+11~17", "+12~18", "+13~19", "+13~20"]
            }
        },
        {
            name: "FMJ High-Velocity Ammo",
            rarity: 2,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's assault rifle-specific FMJ high-velocity ammunition effectively boosts the output of assault rifles through high quality, high pressure gunpowder. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2"]
            }
        },
        {
            name: "JHP High-Velocity Ammo",
            rarity: 4,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's assault rifle-specific JHP high-velocity ammunition was developed with the experience gained from previous bullet designs and experimentations, greatly increasing its damaging capabilities. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+5~7", "+5~7", "+5~8", "+6~8", "+6~9", "+7~9", "+7~10", "+7~10", "+8~11", "+8~12", "+9~12"]
            }
        },
        {
            name: "JSP High-Velocity Ammo",
            rarity: 3,
            exclusive: false,
            usable: ["AR"],
            description: "The FCA Research Center's assault rifle-specific JSP high-velocity ammunition uses an experimental bullet design to further increase the output of assault rifles. They are issued with MP Group's reliable and lightweight magazines.",
            stats: {
                damage: ["+3~4", "+3~4", "+3~4", "+3~5", "+4~5", "+4~6", "+4~6", "+5~6", "+5~7", "+5~7", "+6~8"]
            }
        },
        {
            name: "SP6 Subsonic Ammo",
            rarity: 5,
            exclusive: true,
            usable: ["AS Val"],
            description: "Subsonic ammunition developed for use with a suppressor. Its steel tip makes it highly versatile. Can only be equipped by AS Val.",
            stats: {
                damage: ["+10~14", "+10~15", "+11~16", "+12~17", "+13~18", "+13~19", "+14~20", "+15~21", "+16~22", "+16~23", "+17~24"]
            }
        }
    ],
    hollowPointAmmo: [
        {
            name: ".357 Jacketed Hollow Point Round",
            rarity: 5,
            exclusive: true,
            usable: ["Astra Revolver"],
            description: "The 180gr charge of .357 caliber armored hollow point ammunition has a copper armor that prevents lead from hanging in the barrel and also serves to enlarge the cavity.",
            stats: {
                damage: ["+8~10", "+8~11", "+9~12", "+10~13", "+11~14", "+12~15", "+12~16", "+13~17", "+14~18", "+15~19", "+16~20"],
                armorPiercing: ["-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7"]
            }
        },
        {
            name: ".45 Hollow Point (Incendiary)",
            rarity: 5,
            exclusive: true,
            usable: ["Agent Vector"],
            description: "Modified from normal hollow point rounds, they have a chance to ignite enemies and raise overall DPS.",
            stats: {
                damage: ["+10", "+10", "+11", "+11", "+12", "+12", "+13", "+13", "+14", "+14", "+15"],
                armorPiercing: ["-7", "-7", "-7", "-7", "-7", "-7", "-7", "-7", "-7", "-7", "-7"]
            }
        },
        {
            name: "ILM Hollow Point Ammo",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG"],
            description: "A hollow-point ammunition developed by ILM, it has extreme lethality against unarmored targets, but lacks penetration when facing armored enemies. Can be equipped by HG and SMGs.",
            stats: {
                damage: ["+7~10", "+7~10", "+7~11", "+8~11", "+8~12", "+8~12", "+9~13", "+9~13", "+9~14", "+10~14", "+10~15"],
                armorPiercing: ["-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7"]
            }
        },
        {
            name: "ILM Hollow Point Ammo",
            rarity: 2,
            exclusive: false,
            usable: ["HG", "SMG"],
            description: "A hollow-point ammunition developed by ILM, it helps to increase lethality against unarmored targets, but lacks penetration when facing armored enemies. Can be equipped by HG and SMGs.",
            stats: {
                damage: ["+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1"],
                armorPiercing: ["-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1", "-1~1"]
            }
        },
        {
            name: "ILM Hollow Point Ammo",
            rarity: 3,
            exclusive: false,
            usable: ["HG", "SMG"],
            description: "A hollow-point ammunition developed by ILM, it increases lethality against unarmored targets, but lacks penetration when facing armored enemies. Can be equipped by HG and SMGs.",
            stats: {
                damage: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+2~4", "+2~4", "+3~4", "+3~4", "+3~5"],
                armorPiercing: ["-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2"]
            }
        },
        {
            name: "ILM Hollow Point Ammo",
            rarity: 4,
            exclusive: false,
            usable: ["HG", "SMG"],
            description: "A hollow-point ammunition developed by ILM, it has high lethality against unarmored targets, but lacks penetration when facing armored enemies. Can be equipped by HG and SMGs.",
            stats: {
                damage: ["+4~6", "+4~6", "+4~6", "+4~6", "+4~7", "+5~7", "+5~7", "+5~8", "+5~8", "+5~8", "+6~9"],
                armorPiercing: ["-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4"]
            }
        },
        {
            name: "MIRD Class-5 Rounds",
            rarity: 5,
            exclusive: true,
            usable: ["Dorothy"],
            description: "Dorothy made private modifications to her fingers, allowing them to fire powerful ammunition.",
            stats: {
                damage: ["+12~15", "+12~15", "+13~16", "+13~17", "+14~18", "+15~18", "+15~19", "+16~20", "+16~21", "+17~21", "+18~22"],
                armorPiercing: ["-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7"]
            }
        },
        {
            name: "RIP380ACP",
            rarity: 5,
            exclusive: true,
            usable: ["Skorpion"],
            description: "Spin and explode! These hollowpoint rounds are vicious in appearance and effect, and their expanding tips can do extreme damage to soft targets. Truly a round worthy of the name \"R.I.P.\"",
            stats: {
                damage: ["+7~10", "+7~11", "+8~12", "+9~13", "+9~14", "+10~15", "+11~16", "+11~17", "+12~18", "+13~19", "+14~20"],
                rateOfFire: ["-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4"],
                armorPiercing: ["-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7"]
            }
        },
        {
            name: "S&B762",
            rarity: 5,
            exclusive: true,
            usable: ["Type 79"],
            description: "85-grain full metal jacket bullets allow for greater penetration and have become Type 79's new favorite.",
            stats: {
                damage: ["+12~15", "+12~16", "+13~17", "+14~18", "+15~19", "+16~20", "+16~21", "+17~22", "+18~23", "+19~24", "+20~25"],
                rateOfFire: ["-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4", "-6~4"]
            }
        },
        {
            name: "XM261 ACP",
            rarity: 5,
            exclusive: true,
            usable: ["M1911"],
            description: "The experimental ammunition that was once developed for CQC in the brutal tunnels of the War is essentially a shotgun shell that can be fired with a .45 caliber pistol. Can only be equipped by M1911.",
            stats: {
                damage: ["+8~11", "+8~11", "+8~12", "+9~12", "+9~13", "+10~14", "+10~14", "+11~15", "+11~16", "+12~16", "+12~17"],
                armorPiercing: ["-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7", "-10~7"]
            }
        }
    ],
    armorPiercingAmmo: [
        {
            name: "12.7mm 1SL",
            rarity: 5,
            exclusive: true,
            usable: ["KSVK"],
            description: "These were originally special rounds used by attack helicopters, with a second bullet loaded into the cartridge to improve accuracy against ground targets. KSVK pleaded with I.O.P. to modify these rounds for normal use with her weapon, which would allow her to provide excellent suppressive fire during battles.",
            stats: {
                armorPiercing: ["+110~120", "+115~126", "+121~132", "+126~138", "+132~144", "+137~150", "+143~156", "+148~162", "+154~168", "+159~174", "+165~180"],
                damage: ["+3~5", "+3~5", "+3~6", "+3~6", "+4~7", "+4~7", "+4~8", "+5~8", "+5~9", "+5~9", "+6~10"]
            }
        },
        {
            name: "16Lab Sub-Caliber Armor-Piercing Ammo",
            rarity: 5,
            exclusive: false,
            usable: ["RF", "MG"],
            description: "A depleted uranium high-explosive armor-piercing ammunition recently developed by 16Lab, it is capable of penetrating any type of armor and causing heavy damage. Can be equipped by RFs and MGs.",
            stats: {
                armorPiercing: ["+80", "+84", "+88", "+92", "+96", "+100", "+104", "+108", "+112", "+116", "+120"]
            }
        },
        {
            name: "20mm HEI",
            rarity: 5,
            exclusive: true,
            usable: ["NTW-20 Mod"],
            description: "What is more terrifying than a 20mm round flying towards you at high speed? The answer is a 20mm High-Explosive Incendiary. Before you even hear the gunshot, the wall in front of you, you, the wall behind you, and your neighbor behind the wall behind you...are all gone.",
            stats: {
                armorPiercing: ["+110~120", "+115~126", "+121~132", "+126~138", "+132~144", "+137~150", "+143~156", "+148~162", "+154~168", "+159~174", "+165~180"],
                damage: ["+3~5", "+3~5", "+3~6", "+3~6", "+4~7", "+4~7", "+4~8", "+5~8", "+5~9", "+5~9", "+6~10"]
            }
        },
        {
            name: "M61 Armor-Piercing Ammo",
            rarity: 2,
            exclusive: false,
            usable: ["RF", "MG"],
            description: "The Type M61 armor-piercing ammunition manufactured by IOP Corporation possesses a standard steel-core armor piercing bullet design, aimed at penetrating enemy armor and causing effective damage. Can be equipped by RFs and MGs.",
            stats: {
                armorPiercing: ["+45~55", "+45~55", "+45~55", "+45~55", "+45~55", "+45~55", "+45~55", "+45~55", "+45~55", "+45~55", "+45~55"]
            }
        },
        {
            name: "M993 Armor-Piercing Ammo",
            rarity: 3,
            exclusive: false,
            usable: ["RF", "MG"],
            description: "The Type M993 armor-piercing ammunition manufactured by IOP Corporation was developed to counter enemies possessing thicker armor by using a tungsten alloy material, aimed at penetrating enemy armor and causing effective damage. Can be equipped by RFs and MGs.",
            stats: {
                armorPiercing: ["+65~75", "+68~78", "+71~82", "+74~86", "+78~90", "+81~93", "+84~97", "+87~101", "+91~105", "+94~108", "+97~112"]
            }
        },
        {
            name: "Mk169 Armor-Piercing Ammo",
            rarity: 4,
            exclusive: false,
            usable: ["RF", "MG"],
            description: "The Type Mk169 armor-piercing ammunition developed by IOP in conjunction with the FCA Research Center has a specially made tungsten alloy core designed to be able to penetrate any enemy's armor. Can be equipped by RFs and MGs.",
            stats: {
                armorPiercing: ["+90~100", "+94~105", "+99~110", "+103~114", "+108~120", "+112~125", "+117~130", "+121~135", "+125~140", "+130~145", "+135~150"]
            }
        },
        {
            name: "Mk211 High-Explosive Armor-Piercing Ammo",
            rarity: 5,
            exclusive: false,
            usable: ["RF", "MG"],
            description: "The Type Mk211 high-explosive armor-piercing ammunition developed by IOP in conjunction with the FCA Research Center uses a combination of a tungsten alloy bullet and a high-explosive design to further improve its lethality. Can be equipped by RFs and MGs.",
            stats: {
                armorPiercing: ["+110~120", "+115~126", "+121~132", "+126~138", "+132~144", "+137~150", "+143~156", "+148~162", "+154~168", "+159~174", "+165~180"]
            }
        },
        {
            name: "National Match-Grade Armor-Piercing Ammo",
            rarity: 5,
            exclusive: true,
            usable: ["Springfield"],
            description: "A legacy item of the early 20th century, the National Match-Grade Armor-Piercing Ammunition was specially made for The National Springfield Rifle Match. Can only be equipped by Springfield.",
            stats: {
                armorPiercing: ["+120~130", "+126~136", "+132~143", "+144~156", "+150~162", "+156~169", "+162~175", "+168~182", "+174~188", "+174~188", "+180~195"],
                rateOfFire: ["+1~8", "+1~8", "+1~8", "+1~8", "+1~8", "+1~9", "+1~9", "+1~9", "+1~9", "+1~10", "+1~10"]
            }
        }
    ],
    buckshotAmmo: [
        {
            name: "#0 Buckshot",
            rarity: 3,
            exclusive: false,
            usable: ["SG"],
            description: "Powerful shotgun shells issued by IOP. Each shot contains multiple pellets measuring 8.13mm in diameter. Can be equipped by SGs.",
            stats: {
                damage: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+2~4", "+2~4", "+3~4"],
                criticalDamage: ["+5~6", "+5~6", "+5~6", "+5~6", "+6~7", "+6~7", "+6~7", "+6~8", "+7~8", "+7~8", "+7~9"]
            }
        },
        {
            name: "#00 Buckshot",
            rarity: 4,
            exclusive: false,
            usable: ["SG"],
            description: "Very powerful shotgun shells issued by IOP. Each shot contains multiple pellets measuring 8.38mm in diameter. Can be equipped by SGs.",
            stats: {
                damage: ["+4~6", "+4~6", "+4~6", "+4~6", "+4~7", "+5~7", "+5~7", "+5~8", "+5~8", "+5~8", "+6~9"],
                criticalDamage: ["+7~9", "+7~9", "+7~10", "+8~10", "+8~11", "+9~11", "+9~12", "+9~12", "+10~13", "+10~13", "+11~14"]
            }
        },
        {
            name: "#000 Buckshot",
            rarity: 5,
            exclusive: false,
            usable: ["SG"],
            description: "Extremely powerful shotgun shells issued by IOP. Each shot contains multiple pellets measuring 9.14mm in diameter. Can be equipped by SGs.",
            stats: {
                damage: ["+7~10", "+7~10", "+7~11", "+8~11", "+8~12", "+8~12", "+9~13", "+9~13", "+9~14", "+10~14", "+10~15"],
                criticalDamage: ["+10~15", "+10~15", "+11~16", "+11~17", "+12~18", "+12~18", "+13~19", "+13~20", "+14~21", "+14~21", "+15~22"]
            }
        },
        {
            name: "#1 Buckshot",
            rarity: 2,
            exclusive: false,
            usable: ["SG"],
            description: "High-powered shotgun shells issued by IOP. Each shot contains multiple pellets measuring 7.62mm in diameter. Can be equipped by SGs.",
            stats: {
                damage: ["+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1", "+1~1"],
                criticalDamage: ["+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4"]
            }
        }
    ],
    slugAmmo: [
        {
            name: "BK Slug",
            rarity: 2,
            exclusive: false,
            usable: ["SG"],
            description: "Shotgun slugs issued by IOP. Each shot contains a single large projectile and is designed to deal single-target damage.",
            stats: {
                target: ["-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2"],
                damage: ["*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3"],
                accuracy: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2"]
            }
        },
        {
            name: "FST Slug",
            rarity: 3,
            exclusive: false,
            usable: ["SG"],
            description: "Shotgun slugs issued by IOP. With its mass centered in the front, each single large projectile shot is designed to deal accurate single-target damage.",
            stats: {
                target: ["-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2"],
                damage: ["*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3"],
                accuracy: ["+3~4", "+3~4", "+3~4", "+3~5", "+4~5", "+4~6", "+4~6", "+5~6", "+5~7", "+5~7", "+6~8"]
            }
        },
        {
            name: "SABOT Slug",
            rarity: 5,
            exclusive: false,
            usable: ["SG"],
            description: "Shotgun slugs issued by IOP. After being fired, it gains a steady rotation that provides the shotgun shot with a stable firing trajectory and laser-like precision.",
            stats: {
                target: ["-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2"],
                damage: ["*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3"],
                accuracy: ["+8~12", "+8~12", "+9~13", "+9~14", "+10~15", "+10~16", "+11~17", "+11~17", "+12~18", "+13~19", "+13~20"]
            }
        },
        {
            name: "WAD Slug",
            rarity: 4,
            exclusive: false,
            usable: ["SG"],
            description: "Shotgun slugs issued by IOP. With its mass centered in the front, each single large projectile shot encased in polymer casing is designed to deal highly accurate single-target damage.",
            stats: {
                target: ["-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2"],
                damage: ["*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3", "*3"],
                accuracy: ["+5~7", "+5~7", "+5~8", "+6~8", "+6~9", "+7~10", "+7~10", "+8~11", "+8~12", "+9~12", "+9~13"]
            }
        },
    ],
    exoskeleton: [
        {
            name: "416's Go Bag",
            rarity: 5,
            exclusive: true,
            usable: ["Agent 416"],
            description: "A specially-made backpack modified to 416's personal requirements from a normal SHD go-bag.",
            stats: {
                evasion: ["+12", "+12", "+13", "+14", "+15", "+16", "+17", "+17", "+18", "+19", "+20"]
            }
        },
        {
            name: "GSG UX Exoskeleton",
            rarity: 5,
            exclusive: true,
            usable: ["MP5"],
            description: "A dedicated high-performance exoskeleton specially calibrated for MP5 which maximizes her mobility and evasive capabilities. Can only be equipped by MP5.",
            stats: {
                evasion: ["+30~45", "+30~46", "+31~47", "+32~49", "+33~50", "+34~51", "+35~53", "+36~54" , "+37~55", "+38~57", "+39~58"],
                damage: ["-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6"]
            }
        },
        {
            name: "IOP T1 Exoskeleton",
            rarity: 2,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type T1 Exoskeleton is an early model developed by IOP Corporation, aimed at increasing the agility of T-Dolls through the exoskeleton system. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~8", "+6~8"],
                damage: ["-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1", "-2~1"]
            }
        },
        {
            name: "IOP T2 Exoskeleton",
            rarity: 3,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type T2 Exoskeleton is the standard model manufactured by IOP Corporation with improved performance and flexibility. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+10~12", "+10~12", "+10~12", "+11~13", "+11~13", "+12~14", "+12~14", "+12~15", "+13~15", "+13~16", "+14~16"],
                damage: ["-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3", "-4~3"]
            }
        },
        {
            name: "IOP T3 Exoskeleton",
            rarity: 4,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type T3 Exoskeleton is an enhanced model developed by IOP Corporation. Through improvements in technology, it has greater flexibility while at the same time detracting less from the shooting ability of the user. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+14~16", "+14~16", "+15~17", "+15~17", "+16~18", "+16~19", "+17~19", "+17~20", "+18~21", "+19~21", "+19~22"],
                damage: ["-6~5", "-6~5", "-6~5", "-6~5", "-6~5", "-6~5", "-6~5", "-6~5", "-6~5", "-6~5", "-6~5"]
            }
        },
        {
            name: "IOP T4 Exoskeleton",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type T4 Exoskeleton is a custom model developed by IOP Corporation, specially developed based on the T-Dolls' characteristics so as to maximize their mobility and while minimizing the impact on their shooting ability. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+20~25", "+20~26", "+21~27", "+22~27", "+23~28", "+24~30", "+24~31", "+25~31", "+26~32", "+27~34", "+28~35"],
                damage: ["-8~6", "-8~6", "-8~6", "-8~6", "-8~6", "-8~6", "-8~6", "-8~6", "-8~6", "-8~6", "-8~6"]
            }
        },
        {
            name: "IOP X1 Exoskeleton",
            rarity: 2,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type X1 Exoskeleton is an early model developed by IOP Corporation, aimed at increasing the agility of T-Dolls through the exoskeleton system. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3"]
            }
        },
        {
            name: "IOP X2 Exoskeleton",
            rarity: 3,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type X2 Exoskeleton is the standard model manufactured by IOP Corporation with improved performance and flexibility. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~3"]
            }
        },
        {
            name: "IOP X3 Exoskeleton",
            rarity: 4,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type X3 Exoskeleton is an enhanced model developed by IOP Corporation. Through improvements in technology, it has greater flexibility while at the same time detracting less from the shooting ability of the user. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+6~7", "+6~7", "+7~8", "+7~8", "+8~9", "+8~10", "+9~10", "+9~11", "+10~12", "+10~12", "+10~12", "+11~13"]
            }
        },
        {
            name: "IOP X4 Exoskeleton",
            rarity: 5,
            exclusive: false,
            usable: ["HG", "SMG", "AR"],
            description: "The Type X4 Exoskeleton is a custom model crafted by IOP Corporation, specially developed based on the T-Dolls' characteristics so as to maximize their mobility and while minimizing the impact on their shooting ability. Can be equipped by HGs, SMGs, and most ARs.",
            stats: {
                evasion: ["+8~12", "+8~12", "+9~13", "+9~14", "+10~15", "+10~16", "+11~17", "+11~17", "+12~18", "+13~19", "+13~20"]
            }
        },
        {
            name: "MK31 Multi-functional Exoskeleton",
            rarity: 5,
            exclusive: true,
            usable: ["Suomi"],
            description: "IOP designed for Suomi high-performance leg exoskeleton, the external attached a small mechanical arm for the user to operate. It is the latest exoskeleton that combines operability and maneuverability.",
            stats: {
                evasion: ["+25", "+27", "+29", "+31", "+34", "+36", "+38", "+40", "+43", "+45", "+47"],
                damage: ["-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6"]
            }
        },
        {
            name: "UMP UX Exoskeleton",
            rarity: 5,
            exclusive: true,
            usable: ["UMP9", "UMP40", "UMP45"],
            description: "A highly mobile exoskeleton specially calibrated for T-Dolls of the UMP weapons platform by the former Equipment Department. It greatly increases evasive ability while preserving firing accuracy.",
            stats: {
                evasion: ["+20~25", "+20~26", "+21~27", "+22~27", "+23~28", "+24~30", "+24~31", "+25~31", "+26~32", "+27~34", "+28~35"],
                criticalDamage: ["+11~15", "+11~16", "+12~17", "+13~18", "+13~19", "+14~20", "+15~21", "+16~22", "+16~23", "+17~24", "+18~25"]
            }
        },
        {
            name: "Vector's Go Bag",
            rarity: 5,
            exclusive: true,
            usable: ["Agent Vector"],
            description: "A go bag specially designed for Agent Vector. This compact string bag is both functional and does not impede Vector's operational tempo.",
            stats: {
                evasion: ["+25", "+26", "+27", "+27", "+28", "+30", "+31", "+31", "+32", "+34", "+35"],
                damage: ["-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6", "-6"]
            }
        },
        {
            name: "White Knight's Armor",
            rarity: 5,
            exclusive: true,
            usable: ["Sei"],
            description: "Armor made for White Knights. It rapidly heals its wearer's wounds.",
            stats: {
                evasion: ["+15~20", "+16~21", "+17~22", "+18~24", "+19~25", "+20~27", "+21~28", "+22~29", "+23~31", "+24~32", "+25~34"]
            }
        }
    ],
    ammunitionBox: [
        {
            name: "Infinite Ammo Box",
            rarity: 5,
            exclusive: true,
            usable: ["MG3"],
            description: "A mysterious and powerful equipment left over from ancient times. Although most of these had been confiscated by a certain mysterious authority, one copy has been preserved to this day. Can only be equipped by MG3.",
            stats: {
                clipSize: ["+20", "+21", "+22", "+23", "+24", "+25", "+26", "+27", "+28", "+29", "+30"],
                damage: ["-25", "-25", "-25", "-25", "-25", "-25", "-25", "-25", "-25", "-25", "-25"],
                accuracy: ["-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10"],
                evasion: ["-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2"]
            }
        },
        {
            name: "IOP High-Capacity Ammo Box",
            rarity: 4,
            exclusive: false,
            usable: ["MG"],
            description: "A high-capacity ammunition box specially developed for machine gun T-Dolls by IOP Corporation, it grants them much longer firepower output.",
            stats: {
                clipSize: ["+1", "+1", "+1", "+1", "+1", "+2", "+2", "+2", "+2", "+2", "+3"],
                evasion: ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"]
            }
        },
        {
            name: "IOP Maximum Ammo Box",
            rarity: 5,
            exclusive: false,
            usable: ["MG"],
            description: "An extra-large ammunition box specially developed for machine gun T-Dolls by IOP Corporation, it grants them unmatched firepower.",
            stats: {
                clipSize: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+2~4", "+2~4", "+3~4", "+3~4", "+3~5"],
                evasion: ["-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2"]
            }
        }
    ],
    camouflageCloak: [
        {
            name: "Blue Thick Cape",
            rarity: 5,
            exclusive: true,
            usable: ["PTRD"],
            description: "A cape once worn by a mysterious girl named Pavlichenko, it is able to withstand the piercing cold of Siberia. Can only be equipped by PTRD.",
            stats: {
                criticalDamage: ["+11~15", "+11~16", "+12~17", "+13~18", "+13~19", "+14~20", "+15~21", "+16~22", "+16~23", "+17~24", "+18~25"],
                rateOfFire: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~3", "+1~3", "+1~3", "+1~3", "+1~3", "+2~4"],
                movementSpeed: ["-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3"]
            }
        },
        {
            name: "Camouflage Cape",
            rarity: 3,
            exclusive: false,
            usable: ["RF"],
            description: "A camouflage cape that has been passed down for ages, its mottled edges tell a tale of the flames of war. Having an undisturbed firing environment allows for increased critical damage. Can only be equipped by RFs.",
            stats: {
                criticalDamage: ["+5~7", "+5~7", "+5~8", "+6~8", "+6~9", "+7~10", "+7~10", "+8~11", "+8~12", "+9~12", "+9~13"],
                movementSpeed: ["-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3"]
            }
        },
        {
            name: "Digital Camouflage",
            rarity: 5,
            exclusive: true,
            usable: ["SV-98"],
            description: "A winter digital camouflage cloak suitable for SV-98's operational environments. Increases damage and critical hit damage. Can only be equipped by SV-98.",
            stats: {
                criticalDamage: ["+11~16", "+11~16", "+12~17", "+12~18", "+13~19", "+14~20", "+14~21", "+15~22", "+16~23", "+16~24", "+17~25"],
                damage: ["+2~3", "+2~3", "+2~3", "+2~3", "+2~4", "+3~4", "+3~4", "+3~5", "+3~5", "+3~5", "+4~6"],
                movementSpeed: ["-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3"]
            }
        },
        {
            name: "Ragged Cape",
            rarity: 2,
            exclusive: false,
            usable: ["RF"],
            description: "A ragged cape that has been passed down for ages. Having an undisturbed firing environment allows for increased critical damage. Can only be equipped by RFs.",
            stats: {
                criticalDamage: ["+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~4"],
                movementSpeed: ["-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3"]
            }
        },
        {
            name: "Thermoptic Camouflage Cape",
            rarity: 5,
            exclusive: false,
            usable: ["RF"],
            description: "A thermoptic camouflage cape developed with military technology, it can adapt its camouflage patterns to the surrounding environment when lying still, allowing sharpshooters to massively increase their critical damage. Can only be equipped by RFs.",
            stats: {
                criticalDamage: ["+11~15", "+11~16", "+12~17", "+13~18", "+13~19", "+14~20", "+15~21", "+16~22", "+16~23", "+17~24", "+18~25"],
                movementSpeed: ["-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3"]
            }
        },
        {
            name: "Urban Camouflage Cape",
            rarity: 4,
            exclusive: false,
            usable: ["RF"],
            description: "A digital camouflage cape developed from Sangvis Ferris technology. It is able to blend into most environments. Having an undisturbed firing environment allows for increased critical damage. Can only be equipped by RFs.",
            stats: {
                criticalDamage: ["+8~10", "+8~10", "+9~11", "+9~12", "+10~13", "+11~14", "+11~14", "+12~15", "+13~16", "+13~17", "+14~18"],
                movementSpeed: ["-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3", "-3"]
            }
        }
    ],
    armorPlate: [
        {
            name: "16Lab Armor Plate",
            rarity: 5,
            exclusive: false,
            usable: ["SG"],
            description: "A composite ceramic and kevlar armor plate developed by 16Lab. It possesses a strong bullet-resistant ability and is extremely lightweight. The ideal choice for an elite.",
            stats: {
                armor: ["+8", "+8", "+8", "+8", "+9", "+9", "+9", "+10", "+10", "+10", "+11"],
                evasion: ["-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2", "-2"]
            }
        },
        {
            name: "Special Warfare Mobile Suit",
            rarity: 5,
            exclusive: true,
            usable: ["M16A1"],
            description: "A legacy equipment from before Sangvis Ferris Manufacturing went rogue, it integrates a mobile exoskeleton with durable armor to greatly increase the user's survivability. However, it causes great physical and mental stress to the user.",
            stats: {
                armor: ["+15", "+15", "+16", "+16", "+17", "+17", "+18", "+18", "+19", "+19", "+20"],
                evasion: ["+8", "+8", "+8", "+8", "+8", "+9", "+9", "+9", "+9", "+10", "+10"],
                rateOfFire: ["-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10", "-10"],
                accuracy: ["-20", "-20", "-20", "-20", "-20", "-20", "-20", "-20", "-20", "-20", "-20"]
            }
        },
        {
            name: "Tactical Mobile Shield",
            rarity: 5,
            exclusive: true,
            usable: ["Type 97 Shotgun Mod"],
            description: "IOP designed this high-mobility bulletproof shield for Type 97S with a concise structure and simple appearance, making it highly reliable.",
            stats: {
                armor: ["+6~8", "+6~8", "+6~8", "+6~8", "+6~9", "+7~9", "+7~9", "+7~10", "+7~10", "+8~10", "+8~11"],
                evasion: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2"]
            }
        },
        {
            name: "Type 1 Armor Plate",
            rarity: 3,
            exclusive: false,
            usable: ["SG"],
            description: "The protective grade Type I Fiber Plate provided by IOP Corporation helps to reduce the damage taken from being shot, increasing T-Dolls' survivability on the battlefield.",
            stats: {
                armor: ["+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+3~3", "+4~4", "+4~4"],
                evasion: ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"]
            }
        },
        {
            name: "Type 2 Armor Plate",
            rarity: 4,
            exclusive: false,
            usable: ["SG"],
            description: "The protective grade Type II Composite Plate provided by IOP Corporation helps to greatly reduce the damage taken from being shot, greatly enhancing T-Dolls' survivability on the battlefield.",
            stats: {
                armor: ["+4~5", "+4~5", "+4~5", "+4~5", "+4~5", "+4~6", "+4~6", "+5~6", "+5~6", "+5~6", "+5~7"],
                evasion: ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"]
            }
        },
        {
            name: "Type 3 Armor Plate",
            rarity: 5,
            exclusive: false,
            usable: ["SG"],
            description: "The protective grade Type III Kevlar Plate provided by IOP Corporation can resist high-caliber ammunition, massively enhancing T-Dolls' survivability on the battlefield.",
            stats: {
                armor: ["+6~8", "+6~8", "+6~8", "+6~8", "+6~9", "+7~9", "+7~9", "+7~10", "+7~10", "+8~10", "+8~11"],
                evasion: ["-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2", "-3~2"]
            }
        }
    ],
    chip: [
        {
            name: "Performance+ Cartridge",
            rarity: 5,
            exclusive: true,
            usable: ["IDW"],
            description: "Looks like an antiquated cartridge. Hard to believe that you can increase combat performance just by plugging it in. You should probably blow into it before use. Can only be equipped by IDW.",
            stats: {
                evasion: ["+21~26", "+21~27", "+22~28", "+23~29", "+24~30", "+25~31", "+26~33", "+27~34", "+28~35", "+29~36", "+30~37"],
                rateOfFire: ["+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~2", "+1~3", "+1~3", "+1~3", "+1~3"],
                damage: ["-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6", "-10~6"]
            }
        },
        {
            name: "Tactical Memory Module",
            rarity: 5,
            exclusive: true,
            usable: ["Ameli"],
            description: "Who knew that memory sticks are still a rare luxury in the year of 2063. This Holiday Limited Edition high-performance memory module is both a rare collector's item and an important strategic equipment. Can only be equipped by Ameli.",
            stats: {
                damage: ["+3~5", "+3~5", "+3~5", "+3~6", "+3~6", "+4~6", "+4~7", "+4~7", "+4~7", "+4~8", "+5~8"],
                clipSize: ["+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~5", "+3~5", "+4~5", "+4~5", "+4~5", "+4~6"],
                accuracy: ["-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3", "-5~3"]
            }
        },
        {
            name: "Hayha Memory Chip",
            rarity: 5,
            exclusive: true,
            usable: ["Mosin-Nagant"],
            description: "A memory chip that allows the White Death to once more descend upon the battlefield. Can only be equipped by Mosin-Nagant.",
            stats: {
                damage: ["+18~25", "+18~25", "+18~26", "+19~26", "+19~27", "+19~27", "+20~27", "+20~28", "+20~28", "+21~29", "+21~30"],
                evasion: ["+2~4", "+2~4", "+2~4", "+2~4", "+2~4", "+2~5", "+2~5", "+2~5", "+2~5", "+2~5", "+2~5"],
                criticalDamage: ["+15~20", "+15~21", "+16~22", "+17~23", "+18~24", "+18~25", "+19~26", "+20~27", "+21~28", "+21~29", "+22~30"]
            }
        },
        {
            name: "Titan Fire-Control Chip",
            rarity: 5,
            exclusive: true,
            usable: ["M1918"],
            description: "A fire-control chip that provides an overall increase to specific machine guns' firepower output. It looks strangely familiar for some reason. Can only be equipped by M1918.",
            stats: {
                clipSize: ["+3~4", "+3~4", "+3~4", "+3~4", "+3~4", "+3~5", "+3~5", "+4~5", "+4~5", "+4~5", "+4~6"],
                damage: ["-4~2", "-4~2", "-4~2", "-4~2", "-4~2", "-4~2", "-4~2", "-4~2", "-4~2", "-4~2", "-4~2"],
                rateOfFire: ["-8~1", "-8~1", "-8~1", "-8~1", "-8~1", "-8~1", "-8~1", "-8~1", "-8~1", "-8~1", "-8~1"]
            }
        }
    ]
};

var keys = Object.keys(equipments)
var imageName = ""

/* eslint-disable */
for(var i = 0; i < keys.length; i++){
    equipments[keys[i]].forEach((equipment) => {
        if(equipment.name[0] === "."){
            imageName = equipment.name.substring(1)
        }
        else if(equipment.name === "ILM Hollow Point Ammo"){
            imageName = `${equipment.name} (${equipment.rarity})`
        }
        else{
            imageName = equipment.name
        }

        equipment.image = require(`../images/equipment/${keys[i]}/${imageName}.png`)
    })
}

console.log("Finished processing images for all T-Doll equipment.");

export default equipments;