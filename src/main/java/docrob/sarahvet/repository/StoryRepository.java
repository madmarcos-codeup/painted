package docrob.sarahvet.repository;

import docrob.sarahvet.data.Story;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryRepository extends JpaRepository<Story, Long> {

}