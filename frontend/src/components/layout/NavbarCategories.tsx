import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface NavbarCategoriesProps {
  hoveredCategory: string | null;
  onCategoryHover: (categoryName: string) => void;
  onCategoryLeave: () => void;
  categoryItemsRef: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

const NavbarCategories: React.FC<NavbarCategoriesProps> = ({
  hoveredCategory,
  onCategoryHover,
  onCategoryLeave,
  categoryItemsRef
}) => {
  // Categories for the navigation menu - focused on youth-friendly jobs
  const categories = useMemo(() => [
    { 
      name: 'Alla Jobb', 
      path: '/jobs',
      subcategories: [],
      icon: '💼'
    },
    { 
      name: 'Trädgårdsarbete', 
      path: '/jobs?category=garden',
      subcategories: [
        { name: 'Gräsklippning', path: '/jobs?category=garden&sub=grass-cutting' },
        { name: 'Lövplockning', path: '/jobs?category=garden&sub=leaf-raking' },
        { name: 'Växtvattning', path: '/jobs?category=garden&sub=watering' },
        { name: 'Trädplantering', path: '/jobs?category=garden&sub=planting' }
      ],
      icon: '🌱'
    },
    { 
      name: 'Hundpassning', 
      path: '/jobs?category=dog-sitting',
      subcategories: [
        { name: 'Hundpromenering', path: '/jobs?category=dog-sitting&sub=walking' },
        { name: 'Hundpassning hemma', path: '/jobs?category=dog-sitting&sub=home-sitting' },
        { name: 'Hundträning', path: '/jobs?category=dog-sitting&sub=training' },
        { name: 'Hundmatning', path: '/jobs?category=dog-sitting&sub=feeding' }
      ],
      icon: '🐕'
    },
    { 
      name: 'Barnpassning', 
      path: '/jobs?category=babysitting',
      subcategories: [
        { name: 'Barnpassning hemma', path: '/jobs?category=babysitting&sub=home' },
        { name: 'Barnpassning utomhus', path: '/jobs?category=babysitting&sub=outdoor' },
        { name: 'Läxhjälp för barn', path: '/jobs?category=babysitting&sub=homework' },
        { name: 'Lekaktiviteter', path: '/jobs?category=babysitting&sub=play' }
      ],
      icon: '👶'
    },
    { 
      name: 'Städning', 
      path: '/jobs?category=cleaning',
      subcategories: [
        { name: 'Hemstädning', path: '/jobs?category=cleaning&sub=home' },
        { name: 'Kontorsstädning', path: '/jobs?category=cleaning&sub=office' },
        { name: 'Fönsterputsning', path: '/jobs?category=cleaning&sub=windows' },
        { name: 'Golvstädning', path: '/jobs?category=cleaning&sub=floors' }
      ],
      icon: '🧹'
    },
    { 
      name: 'Datorhjälp', 
      path: '/jobs?category=computer-help',
      subcategories: [
        { name: 'Virusrensning', path: '/jobs?category=computer-help&sub=virus-removal' },
        { name: 'Programinstallation', path: '/jobs?category=computer-help&sub=software' },
        { name: 'Internetproblem', path: '/jobs?category=computer-help&sub=internet' },
        { name: 'Backup av filer', path: '/jobs?category=computer-help&sub=backup' }
      ],
      icon: '💻'
    },
    { 
      name: 'Läxhjälp', 
      path: '/jobs?category=tutoring',
      subcategories: [
        { name: 'Matematik', path: '/jobs?category=tutoring&sub=math' },
        { name: 'Svenska', path: '/jobs?category=tutoring&sub=swedish' },
        { name: 'Engelska', path: '/jobs?category=tutoring&sub=english' },
        { name: 'Naturvetenskap', path: '/jobs?category=tutoring&sub=science' }
      ],
      icon: '📚'
    },
    { 
      name: 'Flytthjälp', 
      path: '/jobs?category=moving',
      subcategories: [
        { name: 'Packning av lådor', path: '/jobs?category=moving&sub=packing' },
        { name: 'Möbelbärning', path: '/jobs?category=moving&sub=furniture' },
        { name: 'Biltransport', path: '/jobs?category=moving&sub=transport' },
        { name: 'Uppackning', path: '/jobs?category=moving&sub=unpacking' }
      ],
      icon: '📦'
    },
    { 
      name: 'Sociala Medier', 
      path: '/jobs?category=social-media',
      subcategories: [
        { name: 'Instagram-hantering', path: '/jobs?category=social-media&sub=instagram' },
        { name: 'Facebook-hantering', path: '/jobs?category=social-media&sub=facebook' },
        { name: 'Innehållsskapande', path: '/jobs?category=social-media&sub=content' },
        { name: 'Hashtag-optimering', path: '/jobs?category=social-media&sub=hashtags' }
      ],
      icon: '📱'
    },
    { 
      name: 'Enklare Matlagning', 
      path: '/jobs?category=cooking',
      subcategories: [
        { name: 'Frukostlagning', path: '/jobs?category=cooking&sub=breakfast' },
        { name: 'Lunchlagning', path: '/jobs?category=cooking&sub=lunch' },
        { name: 'Middagslagning', path: '/jobs?category=cooking&sub=dinner' },
        { name: 'Bakning', path: '/jobs?category=cooking&sub=baking' }
      ],
      icon: '🍳'
    },
    { 
      name: 'Butikshjälp', 
      path: '/jobs?category=retail',
      subcategories: [
        { name: 'Kassatjänst', path: '/jobs?category=retail&sub=cashier' },
        { name: 'Lagerarbete', path: '/jobs?category=retail&sub=warehouse' },
        { name: 'Kundservice', path: '/jobs?category=retail&sub=customer-service' },
        { name: 'Produktplacering', path: '/jobs?category=retail&sub=product-placement' }
      ],
      icon: '🛒'
    },
    { 
      name: 'Cykelreparation', 
      path: '/jobs?category=bike-repair',
      subcategories: [
        { name: 'Däckbyte', path: '/jobs?category=bike-repair&sub=tire-change' },
        { name: 'Bromsjustering', path: '/jobs?category=bike-repair&sub=brake-adjustment' },
        { name: 'Kedjereparation', path: '/jobs?category=bike-repair&sub=chain-repair' },
        { name: 'Ljusinstallation', path: '/jobs?category=bike-repair&sub=light-installation' }
      ],
      icon: '🚲'
    }
  ], []);

  return (
    <div className="navbar-categories">
      <div className="navbar-categories-container">
        <div className="navbar-categories-content">
          {categories.map((category, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) {
                  categoryItemsRef.current.set(category.name, el);
                } else {
                  categoryItemsRef.current.delete(category.name);
                }
              }}
              className="navbar-category-item"
              onMouseEnter={() => onCategoryHover(category.name)}
              onMouseLeave={onCategoryLeave}
            >
              <Link
                to={category.path}
                className="navbar-category-link"
                aria-haspopup={category.subcategories.length > 0}
                aria-expanded={hoveredCategory === category.name}
              >
                <span className="navbar-category-icon">{category.icon}</span>
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarCategories;
